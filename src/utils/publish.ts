import type { Prototype } from '../types'
import { BRIDGE_SCRIPT } from '../components/prototype/SandboxRenderer'

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function extractHeadContent(html: string): string {
  const headMatch = html.match(/<head[^>]*>([\s\S]*)<\/head>/i)
  if (!headMatch) return ''
  return headMatch[1].replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
}

function safeJsString(value: unknown): string {
  return JSON.stringify(value).replace(/<\/script/gi, '<\\/script')
}

export function generatePublishedHTML(prototype: Prototype): string {
  const annotations = prototype.annotations.filter(a => a.description.trim())
  const headContent = extractHeadContent(prototype.generatedCode)

  // Inject the same bridge script used by the platform
  const protoWithBridge = prototype.generatedCode.replace('</head>', BRIDGE_SCRIPT + '</head>')
  const protoJson = safeJsString(protoWithBridge)
  const annotationsJson = safeJsString(annotations)
  const colorsJson = safeJsString(COLORS)

  // Build outer script as plain string to avoid nested template literal issues
  const outerScript = [
    '<script>',
    'var _ANNOTATIONS=' + annotationsJson + ';',
    'var _COLORS=' + colorsJson + ';',
    'var _PAGES=[];',
    'var _ACTIVE_PAGE=null;',
    'var _SELECTED_ID=null;',
    'var _TAB="page";',
    '',
    'function init(){',
    '  var frame=document.getElementById("prototype-frame");',
    '  var html=' + protoJson + ';',
    '  frame.srcdoc=html;',
    '  window.addEventListener("message",function(e){',
    '    if(!e.data||!e.data.type)return;',
    '    if(e.data.type==="smilex-bridge-init"){',
    '      _PAGES=e.data.pages||[];',
    '      _ACTIVE_PAGE=e.data.activePage||null;',
    '      renderPageDropdown();',
    '      renderAnnotationList();',
    '      updateCounts();',
    '      frame.contentWindow.postMessage({type:"smilex-render-annotations",annotations:_ANNOTATIONS,activePage:_ACTIVE_PAGE,selectedId:null},"*");',
    '    }',
    '    if(e.data.type==="smilex-page-change"){',
    '      _ACTIVE_PAGE=e.data.activePage||null;',
    '      updatePageDropdown();',
    '      renderAnnotationList();',
    '    }',
    '    if(e.data.type==="smilex-annotation-click"){',
    '      selectAnnotation(e.data.id);',
    '    }',
    '  });',
    '  document.getElementById("toggle-panel").addEventListener("click",function(){',
    '    document.getElementById("annotation-panel").classList.toggle("open");',
    '  });',
    '}',
    '',
    'function renderPageDropdown(){',
    '  var sel=document.getElementById("page-select");',
    '  if(!_PAGES.length){document.getElementById("page-dropdown").style.display="none";return;}',
    '  document.getElementById("page-dropdown").style.display="";',
    '  sel.innerHTML="";',
    '  _PAGES.forEach(function(p){',
    '    var opt=document.createElement("option");',
    '    opt.value=p.id;opt.textContent=p.name;',
    '    if(p.id===_ACTIVE_PAGE)opt.selected=true;',
    '    sel.appendChild(opt);',
    '  });',
    '}',
    '',
    'function updatePageDropdown(){',
    '  var sel=document.getElementById("page-select");',
    '  sel.value=_ACTIVE_PAGE||"";',
    '  renderAnnotationList();',
    '}',
    '',
    'function switchTab(tab){',
    '  _TAB=tab;',
    '  document.querySelectorAll(".tab-btn").forEach(function(btn){',
    '    btn.classList.toggle("active",btn.getAttribute("data-tab")===tab);',
    '  });',
    '  document.getElementById("page-dropdown").style.display=(tab==="page"&&_PAGES.length)?"":"none";',
    '  renderAnnotationList();',
    '}',
    '',
    'function updateCounts(){',
    '  var pageAnns=_ANNOTATIONS.filter(function(a){return a.scope!=="global";});',
    '  var globalAnns=_ANNOTATIONS.filter(function(a){return a.scope==="global";});',
    '  document.getElementById("page-count").textContent=pageAnns.length;',
    '  document.getElementById("global-count").textContent=globalAnns.length;',
    '}',
    '',
    'function navigateToPage(pageId){',
    '  var frame=document.getElementById("prototype-frame");',
    '  frame.contentWindow.postMessage({type:"smilex-navigate",page:pageId},"*");',
    '}',
    '',
    'function renderAnnotationList(){',
    '  var container=document.getElementById("annotation-list");',
    '  var filtered;',
    '  if(_TAB==="global"){',
    '    filtered=_ANNOTATIONS.filter(function(a){return a.scope==="global";});',
    '  }else{',
    '    filtered=_ACTIVE_PAGE?_ANNOTATIONS.filter(function(a){',
    '      return a.scope!=="global"&&(a.page===_ACTIVE_PAGE||(!a.page&&a.scope!=="global"));',
    '    }):_ANNOTATIONS.filter(function(a){return a.scope!=="global";});',
    '  }',
    '  if(!filtered.length){container.innerHTML="<div class=\\"empty-msg\\">"+(_TAB==="global"?"暂无通用标注":"当前页面暂无标注")+"</div>";return;}',
    '  container.innerHTML="";',
    '  filtered.forEach(function(a){',
    '    var color=_COLORS[(a.markerNumber-1)%_COLORS.length];',
    '    var div=document.createElement("div");',
    '    div.className="ann-item"+(a.id===_SELECTED_ID?" active":"");',
    '    div.setAttribute("data-ann-id",a.id);',
    '    div.innerHTML="<div class=\\"ann-badge\\" style=\\"background:"+color+"\\">"+a.markerNumber+"</div>"',
    '      +(a.scope==="global"?"<span class=\\"ann-scope\\">通用</span>":"")',
    '      +"<p class=\\"ann-desc\\">"+escapeHtmlSimple(a.description)+"</p>";',
    '    div.addEventListener("click",function(){selectAnnotation(a.id);});',
    '    container.appendChild(div);',
    '  });',
    '}',
    '',
    'function selectAnnotation(id){',
    '  _SELECTED_ID=id;',
    '  document.querySelectorAll(".ann-item").forEach(function(el){',
    '    el.classList.toggle("active",el.getAttribute("data-ann-id")===id);',
    '  });',
    '  var ann=_ANNOTATIONS.find(function(a){return a.id===id;});',
    '  if(ann&&ann.scope==="page"&&ann.page)navigateToPage(ann.page);',
    '  var frame=document.getElementById("prototype-frame");',
    '  frame.contentWindow.postMessage({type:"smilex-render-annotations",annotations:_ANNOTATIONS,activePage:_ACTIVE_PAGE,selectedId:id},"*");',
    '  setTimeout(function(){',
    '    frame.contentWindow.postMessage({type:"smilex-focus-annotation",id:id},"*");',
    '  },100);',
    '}',
    '',
    'function escapeHtmlSimple(s){',
    '  return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");',
    '}',
    '',
    'document.addEventListener("DOMContentLoaded",init);',
    '<' + '/script>',
  ].join('\n')

  return `<!DOCTYPE html>
<html lang="zh-CN">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(prototype.name)} - 标注预览</title>
${headContent}
<style>
* { margin: 0; padding: 0; box-sizing: border-box; }
html, body { height: 100%; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background: #f0f0f0; }
#app-container { display: flex; height: 100vh; }
#prototype-frame { flex: 1; border: none; background: #fff; }
#annotation-panel { width: 300px; background: #fff; border-left: 1px solid #e0e0e0; display: flex; flex-direction: column; overflow: hidden; }
#panel-header { padding: 12px 16px; border-bottom: 1px solid #e0e0e0; display: flex; align-items: center; justify-content: space-between; }
#panel-header h3 { font-size: 14px; font-weight: 600; color: #1a1a1a; }
#panel-header span { font-size: 12px; color: #888; }
.tab-bar { display: flex; border-bottom: 1px solid #e0e0e0; padding: 0 12px; }
.tab-btn { padding: 8px 12px; font-size: 12px; cursor: pointer; border: none; background: none; color: #888; border-bottom: 2px solid transparent; transition: all .15s; }
.tab-btn:hover { color: #333; }
.tab-btn.active { color: #1a1a1a; border-bottom-color: #2563eb; font-weight: 500; }
.tab-badge { font-size: 10px; background: #e5e7eb; color: #555; border-radius: 8px; padding: 0 5px; margin-left: 4px; }
.page-dropdown { padding: 8px 12px; border-bottom: 1px solid #eee; }
.page-dropdown label { display: block; font-size: 10px; font-weight: 500; color: #999; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
.page-dropdown select { width: 100%; padding: 4px 8px; font-size: 12px; border: 1px solid #ddd; border-radius: 4px; background: #fff; cursor: pointer; outline: none; }
.page-dropdown select:focus { border-color: #2563eb; }
#annotation-list { flex: 1; overflow-y: auto; padding: 8px; }
.ann-item { display: flex; align-items: flex-start; gap: 8px; padding: 8px; border-radius: 6px; cursor: pointer; transition: background .15s; margin-bottom: 4px; }
.ann-item:hover { background: #f5f5f5; }
.ann-item.active { background: #eff6ff; }
.ann-badge { flex-shrink: 0; width: 20px; height: 20px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 700; color: #fff; }
.ann-scope { font-size: 9px; color: #888; border: 1px solid #ddd; border-radius: 3px; padding: 0 4px; flex-shrink: 0; margin-top: 2px; }
.ann-desc { font-size: 12px; line-height: 1.5; color: #333; white-space: pre-wrap; word-break: break-word; }
.empty-msg { text-align: center; color: #aaa; padding: 24px; font-size: 13px; }
#toggle-panel { display: none; position: fixed; top: 8px; right: 8px; z-index: 1000; background: #fff; border: 1px solid #ddd; border-radius: 6px; padding: 6px 10px; font-size: 12px; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
@media (max-width: 768px) {
  #annotation-panel { position: fixed; right: 0; top: 0; bottom: 0; z-index: 999; transform: translateX(100%); transition: transform .3s; }
  #annotation-panel.open { transform: translateX(0); }
  #toggle-panel { display: block; }
}
</style>
</head>
<body>
<div id="app-container">
  <iframe id="prototype-frame" sandbox="allow-scripts allow-same-origin allow-forms"></iframe>
  <div id="annotation-panel">
    <div id="panel-header">
      <h3>${escapeHtml(prototype.name)}</h3>
      <span>${annotations.length} 个标注</span>
    </div>
    <div class="tab-bar">
      <button class="tab-btn active" data-tab="page" onclick="switchTab('page')">页面<span class="tab-badge" id="page-count">0</span></button>
      <button class="tab-btn" data-tab="global" onclick="switchTab('global')">通用<span class="tab-badge" id="global-count">0</span></button>
    </div>
    <div class="page-dropdown" id="page-dropdown">
      <label>页面</label>
      <select id="page-select" onchange="navigateToPage(this.value)"></select>
    </div>
    <div id="annotation-list"></div>
  </div>
</div>
<button id="toggle-panel">标注</button>
${outerScript}
</body>
</html>`
}

export function downloadPublishedHTML(prototype: Prototype): void {
  const html = generatePublishedHTML(prototype)
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `publish-${prototype.id}.html`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}
