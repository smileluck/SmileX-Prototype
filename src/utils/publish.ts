import type { Prototype } from '../types'

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']

function escapeHtml(s: string): string {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
}

function extractHeadContent(html: string): string {
  const headMatch = html.match(/<head[^>]*>([\s\S]*)<\/head>/i)
  if (!headMatch) return ''
  return headMatch[1].replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
}

// Simplified bridge script for published HTML — only marker rendering + tooltip, no placement
function bridgeScript(): string {
  return `<script>
(function(){
  var COLORS=['#2563eb','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#14b8a6','#f97316'];
  function markerColor(n){return COLORS[(n-1)%COLORS.length];}
  var _currentAnnotations=[],_currentActivePage=null,_currentSelectedId=null;
  var _posTimer=null;
  function schedulePosition(){if(_posTimer)return;_posTimer=setTimeout(function(){_posTimer=null;positionMarkers();},16);}
  function isPopupEl(el){
    if(!el||el===document.body)return false;
    var cls=(el.className||'').toString();var id=(el.id||'').toString();
    return/(?:modal|dialog|popup|drawer)/i.test(id)||/(?:modal|dialog|popup|drawer)[-_]?overlay/i.test(cls);
  }
  function findHiddenPopup(el){var cur=el;while(cur&&cur!==document.body){if(isPopupEl(cur)&&!cur.classList.contains('active'))return cur;cur=cur.parentElement;}return null;}
  function openPopupFor(el){var cur=el;while(cur&&cur!==document.body){if(isPopupEl(cur)){var id=(cur.id||'').toString();if(id){try{if(typeof window.openModal==='function'){window.openModal(id);return;}}catch(e){}try{if(typeof window.openDrawer==='function'){window.openDrawer(id);return;}}catch(e){}}if(!cur.classList.contains('active'))cur.classList.add('active');return;}cur=cur.parentElement;}}
  function querySelectorInPage(selector,container){if(!selector)return null;var el=container?container.querySelector(selector):null;if(!el)el=document.querySelector(selector);return el;}
  function pageName(el,id){var n=el.getAttribute('data-page-name');if(n)return n;try{if(typeof pageNames!=='undefined'&&pageNames[id])return pageNames[id];}catch(e){}var nav=document.querySelector('.nav-item[data-page="'+id+'"]');if(nav)return nav.textContent.trim();var h=el.querySelector('h1,h2,h3');if(h)return h.textContent.trim();return id;}
  function discoverPages(){
    var pages=[];var standalone=[];
    document.querySelectorAll('body > [id]').forEach(function(el){
      if(el.querySelector('.page-section'))return;
      var isPage=el.classList.contains('page-section')||el.hasAttribute('data-page-name')||el.id.match(/Page$/i);
      if(!isPage)return;
      var id=el.classList.contains('page-section')?el.id.replace('page-',''):el.id;
      pages.push({id:id,name:pageName(el,id)});
      if(!el.classList.contains('page-section'))standalone.push(el);
    });
    document.querySelectorAll('.page-section').forEach(function(s){
      var id=s.id.replace('page-','');
      if(!pages.some(function(p){return p.id===id;}))
        pages.push({id:id,name:pageName(s,id)});
    });
    return {pages:pages,standalone:standalone};
  }
  function isVisible(el){return el.style.display!=='none'&&el.offsetWidth>0;}
  function getActivePage(standalone){
    for(var i=0;i<standalone.length;i++){if(isVisible(standalone[i]))return standalone[i].id;}
    var el=document.querySelector('.page-section.active');
    return el?el.id.replace('page-',''):null;
  }
  function send(type,data){try{window.parent.postMessage(Object.assign({type:type},data),'*');}catch(e){}}
  function report(standalone){send('smilex-page-change',{activePage:getActivePage(standalone)});}
  function applyHighlight(target,isActive,color){
    target.classList.add('smilex-target-highlight');
    var cs=window.getComputedStyle(target);
    if(cs.position==='static')target.style.position='relative';
    var curZ=parseInt(cs.zIndex)||0;if(curZ<199)target.style.zIndex='199';
    target.style.outline=isActive?'3px solid '+color:'2px solid '+color;
    target.style.backgroundColor=isActive?'rgba(0,0,0,0.04)':'';
  }
  function renderMarkers(annotations,activePage,selectedId){
    document.querySelectorAll('.smilex-marker,.smilex-tip').forEach(function(m){m.remove();});
    document.querySelectorAll('.smilex-target-highlight').forEach(function(el){el.classList.remove('smilex-target-highlight');el.style.outline='';el.style.backgroundColor='';el.style.position='';el.style.zIndex='';});
    _currentAnnotations=annotations;_currentActivePage=activePage;_currentSelectedId=selectedId;
    var byPage={};
    annotations.forEach(function(a){if(a.scope==='global')return;var pg=a.page||activePage;if(!byPage[pg])byPage[pg]=[];byPage[pg].push(a);});
    Object.keys(byPage).forEach(function(pageId){
      var container=document.getElementById('page-'+pageId)||document.getElementById(pageId);
      if(!container)return;
      byPage[pageId].forEach(function(a){
        var target=querySelectorInPage(a.selector,container);
        if(!target||findHiddenPopup(target))return;
        var color=markerColor(a.markerNumber);var isActive=a.id===selectedId;
        applyHighlight(target,isActive,color);
        var el=document.createElement('div');el.className='smilex-marker'+(isActive?' smilex-marker-active':'');
        el.style.cssText='position:fixed;z-index:200;background:'+color+';display:none;width:24px;height:24px;border-radius:50%;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;box-shadow:0 2px 8px rgba(0,0,0,0.25);cursor:pointer;pointer-events:auto;border:none;padding:0;margin:0;font-family:-apple-system,BlinkMacSystemFont,sans-serif;line-height:1;';
        el.textContent=a.markerNumber;el.setAttribute('data-ann-id',a.id);
        el.addEventListener('click',function(e){e.stopPropagation();send('smilex-annotation-click',{id:a.id});showTip(a,el);});
        document.body.appendChild(el);
      });
    });
    annotations.forEach(function(a){
      if(a.scope!=='global')return;
      var appEl=document.getElementById('app');var target=querySelectorInPage(a.selector,appEl);
      if(!target||findHiddenPopup(target))return;
      var color=markerColor(a.markerNumber);var isActive=a.id===selectedId;
      applyHighlight(target,isActive,color);
      var el=document.createElement('div');el.className='smilex-marker'+(isActive?' smilex-marker-active':'');
      el.style.cssText='position:fixed;z-index:200;background:'+color+';display:none;width:24px;height:24px;border-radius:50%;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:#fff;box-shadow:0 2px 8px rgba(0,0,0,0.25);cursor:pointer;pointer-events:auto;border:none;padding:0;margin:0;font-family:-apple-system,BlinkMacSystemFont,sans-serif;line-height:1;';
      el.textContent=a.markerNumber;el.setAttribute('data-ann-id',a.id);
      el.addEventListener('click',function(e){e.stopPropagation();send('smilex-annotation-click',{id:a.id});showTip(a,el);});
      document.body.appendChild(el);
    });
    positionMarkers();
  }
  function showTip(ann,marker){
    var old=document.querySelector('.smilex-tip');if(old)old.remove();
    var tip=document.createElement('div');tip.className='smilex-tip';
    tip.style.cssText='position:fixed;z-index:10010;background:#1e293b;color:#fff;padding:8px 14px;border-radius:8px;max-width:260px;box-shadow:0 4px 16px rgba(0,0,0,0.25);pointer-events:none;opacity:0;transform:translateY(6px);transition:opacity .2s,transform .2s;font-family:-apple-system,BlinkMacSystemFont,sans-serif;font-size:12px;line-height:1.4;white-space:normal;border:none;margin:0;';
    var color=markerColor(ann.markerNumber);
    tip.innerHTML='<div style="display:flex;align-items:flex-start;gap:8px"><span style="display:inline-flex;align-items:center;justify-content:center;min-width:18px;height:18px;border-radius:50%;background:'+color+';font-size:10px;font-weight:700;color:#fff;line-height:18px">'+ann.markerNumber+'</span><span>'+ann.description+'</span></div>';
    document.body.appendChild(tip);
    var mRect=marker.getBoundingClientRect();var tipH=tip.offsetHeight,tipW=tip.offsetWidth;
    var left=mRect.left+mRect.width/2-tipW/2;var top=mRect.bottom+8;
    if(top+tipH>window.innerHeight-8)top=mRect.top-tipH-8;
    left=Math.max(8,Math.min(left,window.innerWidth-tipW-8));
    tip.style.left=left+'px';tip.style.top=top+'px';
    requestAnimationFrame(function(){tip.style.opacity='1';tip.style.transform='translateY(0)';});
    setTimeout(function(){tip.style.opacity='0';tip.style.transform='translateY(6px)';setTimeout(function(){tip.remove();},200);},3000);
  }
  function positionMarkers(){
    var annotations=_currentAnnotations,activePage=_currentActivePage;
    document.querySelectorAll('.smilex-marker').forEach(function(marker){
      var annId=marker.getAttribute('data-ann-id');var ann=annotations.find(function(a){return a.id===annId;});
      if(!ann)return;var target;
      if(ann.scope==='global'){target=querySelectorInPage(ann.selector,document.getElementById('app'));}
      else{var pg=ann.page||activePage;var container=document.getElementById('page-'+pg)||document.getElementById(pg);target=querySelectorInPage(ann.selector,container);}
      if(!target){marker.style.display='none';return;}
      if(findHiddenPopup(target)){marker.style.display='none';return;}
      var r=target.getBoundingClientRect();if(r.width===0&&r.height===0){marker.style.display='none';return;}
      marker.style.display='flex';
      if(r.width<60){marker.style.left=(r.right+3)+'px';marker.style.top=(r.top+r.height/2-12)+'px';}
      else{marker.style.left=(r.right-15)+'px';marker.style.top=(r.top-6)+'px';}
    });
  }
  var _standalone=[];
  function setup(){
    var result=discoverPages();var pages=result.pages;_standalone=result.standalone;
    send('smilex-bridge-init',{pages:pages,activePage:getActivePage(_standalone)});
    document.querySelectorAll('.page-section').forEach(function(s){new MutationObserver(function(){report(_standalone);}).observe(s,{attributes:true,attributeFilter:['class']});});
    _standalone.forEach(function(el){new MutationObserver(function(){report(_standalone);}).observe(el,{attributes:true,attributeFilter:['style']});});
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',setup);}else{setup();}
  window.addEventListener('message',function(e){
    if(!e.data||!e.data.type)return;
    if(e.data.type==='smilex-navigate'){
      var target=e.data.page;var el=document.getElementById('page-'+target)||document.getElementById(target);if(!el)return;
      if(el.classList.contains('page-section')){
        _standalone.forEach(function(s){s.style.display='none';});var app=document.getElementById('app');if(app)app.style.display='';
        document.querySelectorAll('.page-section').forEach(function(p){p.classList.remove('active');});el.classList.add('active');
      }else{el.style.display='';var app=document.getElementById('app');if(app)app.style.display='none';}
    }
    if(e.data.type==='smilex-render-annotations'){renderMarkers(e.data.annotations||[],e.data.activePage,e.data.selectedId||null);}
    if(e.data.type==='smilex-focus-annotation'){
      var annId=e.data.id;var ann=_currentAnnotations.find(function(a){return a.id===annId;});if(!ann)return;
      var targetEl;
      if(ann.scope==='global'){targetEl=querySelectorInPage(ann.selector,document.getElementById('app'));}
      else{var pg=ann.page||_currentActivePage;var container=document.getElementById('page-'+pg)||document.getElementById(pg);targetEl=querySelectorInPage(ann.selector,container);}
      if(!targetEl)return;openPopupFor(targetEl);
      targetEl.scrollIntoView({behavior:'smooth',block:'center'});
    }
  });
  var _ro=new ResizeObserver(function(){schedulePosition();});_ro.observe(document.documentElement);
  window.addEventListener('scroll',function(){schedulePosition();},true);
  window.addEventListener('resize',function(){schedulePosition();});
  new MutationObserver(function(mutations){
    schedulePosition();
    for(var i=0;i<mutations.length;i++){
      var m=mutations[i];if(m.type==='attributes'&&m.attributeName==='class'&&m.target&&m.target.classList){
        var el=m.target;if(isPopupEl(el)){var oldCls=m.oldValue||'';var hadActive=oldCls.indexOf('active')>=0;var hasActive=el.classList.contains('active');
        if(hadActive!==hasActive){renderMarkers(_currentAnnotations,_currentActivePage,_currentSelectedId);break;}}
      }
    }
  }).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['style','class'],attributeOldValue:true});
})();
<` + `/script>`
}

export function generatePublishedHTML(prototype: Prototype): string {
  const annotations = prototype.annotations.filter(a => a.description.trim())
  const headContent = extractHeadContent(prototype.generatedCode)

  // Pre-inject bridge script into prototype HTML
  const bridge = bridgeScript()
  const protoWithBridge = prototype.generatedCode.replace('</head>', bridge + '</head>')
  // JSON.stringify then escape </script so HTML parser doesn't break the outer <script> block
  const protoJson = JSON.stringify(protoWithBridge).replace(/<\/script/gi, '<\\/script')

  const colorsJson = JSON.stringify(COLORS)
  const annotationsJson = JSON.stringify(annotations).replace(/<\/script/gi, '<\\/script')

  // Build outer script as plain string (no nested template literals)
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
