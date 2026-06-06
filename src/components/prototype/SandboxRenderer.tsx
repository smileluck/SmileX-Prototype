import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import type { Annotation, PageInfo } from '../../types'

interface SandboxRendererProps {
  htmlCode: string
  onContentReady?: () => void
  onPagesDiscovered?: (pages: PageInfo[]) => void
  onActivePageChange?: (page: string | null) => void
  onAnnotationClick?: (id: string) => void
  onAnnotationPlaced?: (selector: string, page: string) => void
}

export interface SandboxRendererHandle {
  navigateToPage: (page: string) => void
  renderAnnotations: (annotations: Annotation[], activePage: string | null, selectedId: string | null) => void
  startPlacing: () => void
  cancelPlacing: () => void
}

const BRIDGE_SCRIPT = `<script>
(function(){
  var _standalone=[];
  var _placing=false;

  // Inject marker styles
  var ms=document.createElement('style');
  ms.textContent='.smilex-marker{position:fixed!important;z-index:200!important;width:24px!important;height:24px!important;display:flex!important;align-items:center!important;justify-content:center!important;border-radius:50%!important;font-size:11px!important;font-weight:700!important;color:#fff!important;box-shadow:0 2px 8px rgba(0,0,0,0.25)!important;cursor:pointer!important;transition:transform .15s,box-shadow .15s;-webkit-user-select:none!important;user-select:none!important;font-family:-apple-system,BlinkMacSystemFont,sans-serif!important;line-height:1!important;pointer-events:auto!important;border:none!important;padding:0!important;margin:0!important}.smilex-marker:hover{transform:scale(1.25);box-shadow:0 4px 16px rgba(0,0,0,0.35)}.smilex-marker-active{outline:2px solid #fff!important}.smilex-target-highlight{z-index:199!important;position:relative!important;outline-offset:3px;transition:outline-color .2s,background-color .2s}.smilex-placing-active{cursor:crosshair!important;z-index:200!important;position:relative!important}.smilex-placing-active *{cursor:crosshair!important}.smilex-placing-highlight{outline:2px dashed #2563eb!important;outline-offset:2px;background-color:rgba(37,99,235,0.05)!important;z-index:200!important}';
  document.head.appendChild(ms);

  // Track current annotation data for repositioning
  var _currentAnnotations=[];
  var _currentActivePage=null;
  var _currentSelectedId=null;

  var COLORS=['#2563eb','#10b981','#f59e0b','#ef4444','#8b5cf6','#ec4899','#14b8a6','#f97316'];
  function markerColor(num){return COLORS[(num-1)%COLORS.length];}

  function pageName(el,id){
    var n=el.getAttribute('data-page-name');if(n)return n;
    try{if(typeof pageNames!=='undefined'&&pageNames[id])return pageNames[id];}catch(e){}
    var nav=document.querySelector('.nav-item[data-page="'+id+'"]');
    if(nav)return nav.textContent.trim();
    var h=el.querySelector('h1,h2,h3');if(h)return h.textContent.trim();
    return id;
  }
  function discoverPages(){
    var pages=[];
    _standalone=[];
    document.querySelectorAll('body > [id]').forEach(function(el){
      if(el.querySelector('.page-section'))return;
      var isPage=el.classList.contains('page-section')||el.hasAttribute('data-page-name')||el.id.match(/Page$/i);
      if(!isPage)return;
      var id=el.classList.contains('page-section')?el.id.replace('page-',''):el.id;
      pages.push({id:id,name:pageName(el,id)});
      if(!el.classList.contains('page-section'))_standalone.push(el);
    });
    document.querySelectorAll('.page-section').forEach(function(s){
      var id=s.id.replace('page-','');
      if(!pages.some(function(p){return p.id===id;}))
        pages.push({id:id,name:pageName(s,id)});
    });
    return pages;
  }
  function isVisible(el){return el.style.display!=='none'&&el.offsetWidth>0;}
  function getActivePage(){
    for(var i=0;i<_standalone.length;i++){if(isVisible(_standalone[i]))return _standalone[i].id;}
    var el=document.querySelector('.page-section.active');
    return el?el.id.replace('page-',''):null;
  }
  function send(type,data){try{window.parent.postMessage(Object.assign({type:type},data),'*');}catch(e){}}
  function report(){send('smilex-page-change',{activePage:getActivePage()});}

  // Generate a unique CSS selector for an element
  function getSelector(el){
    if(!el||el===document.body||el===document.documentElement) return 'body';
    if(el.id) return '#'+el.id;
    var parts=[];
    while(el&&el!==document.body&&el!==document.documentElement){
      if(el.id){parts.unshift('#'+el.id);break;}
      var tag=el.tagName.toLowerCase();
      if(tag==='body'||tag==='html')break;
      var parent=el.parentElement;
      if(parent){
        var siblings=Array.prototype.filter.call(parent.children,function(c){return c.tagName===el.tagName;});
        if(siblings.length>1){
          var idx=Array.prototype.indexOf.call(siblings,el)+1;
          parts.unshift(tag+':nth-of-type('+idx+')');
        }else{
          parts.unshift(tag);
        }
      }else{
        parts.unshift(tag);
      }
      el=parent;
    }
    return parts.join(' > ');
  }

  // Throttle helper for high-frequency events
  var _posTimer=null;
  function schedulePosition(){
    if(_posTimer)return;
    _posTimer=setTimeout(function(){_posTimer=null;positionMarkers();},16);
  }

  function renderMarkers(annotations,activePage,selectedId){
    document.querySelectorAll('.smilex-marker').forEach(function(m){m.remove();});
    document.querySelectorAll('.smilex-target-highlight').forEach(function(el){el.classList.remove('smilex-target-highlight');el.style.outline='';el.style.backgroundColor='';el.style.position='';});

    _currentAnnotations=annotations;
    _currentActivePage=activePage;
    _currentSelectedId=selectedId;

    var byPage={};
    annotations.forEach(function(a){
      var pg=a.page||activePage;
      if(!byPage[pg])byPage[pg]=[];
      byPage[pg].push(a);
    });

    Object.keys(byPage).forEach(function(pageId){
      var container=document.getElementById('page-'+pageId)||document.getElementById(pageId);
      if(!container)return;

      byPage[pageId].forEach(function(a){
        var target=container.querySelector(a.selector);
        if(!target)return;
        var color=markerColor(a.markerNumber);
        var isActive=a.id===selectedId;

        // Highlight target element with colored border
        target.classList.add('smilex-target-highlight');
        target.style.position='relative';
        target.style.outline=isActive?'3px solid '+color:'2px solid '+color;
        target.style.backgroundColor=isActive?'rgba(0,0,0,0.04)':'';

        // Always create marker (even for hidden targets — modals/tabs may show later)
        var el=document.createElement('div');
        el.className='smilex-marker'+(isActive?' smilex-marker-active':'');
        el.style.position='fixed';
        el.style.zIndex='200';
        el.style.background=color;
        el.style.display='none';
        el.textContent=a.markerNumber;
        el.setAttribute('data-ann-id',a.id);
        el.addEventListener('click',function(e){
          e.stopPropagation();
          send('smilex-annotation-click',{id:a.id});
        });
        document.body.appendChild(el);
      });
    });

    positionMarkers();
  }

  function positionMarkers(){
    var annotations=_currentAnnotations;
    var activePage=_currentActivePage;

    document.querySelectorAll('.smilex-marker').forEach(function(marker){
      var annId=marker.getAttribute('data-ann-id');
      var ann=annotations.find(function(a){return a.id===annId;});
      if(!ann)return;
      var pg=ann.page||activePage;
      var container=document.getElementById('page-'+pg)||document.getElementById(pg);
      if(!container){marker.style.display='none';return;}
      var target=container.querySelector(ann.selector);
      if(!target){marker.style.display='none';return;}
      var r=target.getBoundingClientRect();
      if(r.width===0&&r.height===0){marker.style.display='none';return;}
      marker.style.display='';
      // Small elements (buttons): place marker outside to preserve click area
      if(r.width<60){
        marker.style.left=(r.right+3)+'px';
        marker.style.top=(r.top+r.height/2-12)+'px';
      }else{
        marker.style.left=(r.right-15)+'px';
        marker.style.top=(r.top-6)+'px';
      }
    });
  }

  // Auto-reposition on layout change, scroll, and DOM mutations
  var _ro=new ResizeObserver(function(){schedulePosition();});
  _ro.observe(document.documentElement);
  window.addEventListener('scroll',function(){schedulePosition();},true);
  window.addEventListener('resize',function(){schedulePosition();});
  new MutationObserver(function(){schedulePosition();}).observe(document.documentElement,{childList:true,subtree:true,attributes:true,attributeFilter:['style','class']});

  // Placing mode: highlight on hover, capture click to get selector
  var _lastHighlight=null;
  function placingOver(e){
    var el=e.target;
    if(!el||el.classList.contains('smilex-marker'))return;
    if(_lastHighlight&&_lastHighlight!==el) _lastHighlight.classList.remove('smilex-placing-highlight');
    el.classList.add('smilex-placing-highlight');
    _lastHighlight=el;
  }
  function placingOut(e){
    if(_lastHighlight){_lastHighlight.classList.remove('smilex-placing-highlight');_lastHighlight=null;}
  }
  function placingClick(e){
    if(!_placing)return;
    e.preventDefault();
    e.stopPropagation();
    var el=e.target;
    // Walk up to find meaningful element (skip text nodes, svg, etc)
    while(el&&(!el.tagName||(el.tagName==='svg'||el.tagName==='path'||el.classList&&el.classList.contains('smilex-marker')))){
      el=el.parentElement;
    }
    if(!el||el===document.body||el===document.documentElement)return;
    var sel=getSelector(el);
    var page=getActivePage();
    // Exit placing mode
    exitPlacing();
    send('smilex-annotation-placed',{selector:sel,page:page});
  }
  function enterPlacing(){
    _placing=true;
    document.body.classList.add('smilex-placing-active');
    document.addEventListener('mouseover',placingOver,true);
    document.addEventListener('mouseout',placingOut,true);
    document.addEventListener('click',placingClick,true);
  }
  function exitPlacing(){
    _placing=false;
    document.body.classList.remove('smilex-placing-active');
    document.removeEventListener('mouseover',placingOver,true);
    document.removeEventListener('mouseout',placingOut,true);
    document.removeEventListener('click',placingClick,true);
    if(_lastHighlight){_lastHighlight.classList.remove('smilex-placing-highlight');_lastHighlight=null;}
  }

  function setup(){
    var pages=discoverPages();
    send('smilex-bridge-init',{pages:pages,activePage:getActivePage()});
    document.querySelectorAll('.page-section').forEach(function(s){
      new MutationObserver(report).observe(s,{attributes:true,attributeFilter:['class']});
    });
    _standalone.forEach(function(el){
      new MutationObserver(report).observe(el,{attributes:true,attributeFilter:['style']});
    });
  }
  if(document.readyState==='loading'){document.addEventListener('DOMContentLoaded',setup);}
  else{setup();}
  window.addEventListener('message',function(e){
    if(!e.data||!e.data.type)return;
    if(e.data.type==='smilex-navigate'){
      var target=e.data.page;
      var el=document.getElementById('page-'+target)||document.getElementById(target);
      if(!el)return;
      if(el.classList.contains('page-section')){
        _standalone.forEach(function(s){s.style.display='none';});
        var app=document.getElementById('app');if(app)app.style.display='';
        document.querySelectorAll('.page-section').forEach(function(p){p.classList.remove('active');});
        el.classList.add('active');
        document.querySelectorAll('.nav-item').forEach(function(n){n.classList.remove('active');});
        var nav=document.querySelector('.nav-item[data-page="'+target+'"]');
        if(nav)nav.classList.add('active');
        var title=document.getElementById('pageTitle');
        if(title){try{if(typeof pageNames!=='undefined')title.textContent=pageNames[target]||target;}catch(e){}}
      }else{
        el.style.display='';
        var app=document.getElementById('app');if(app)app.style.display='none';
      }
    }
    if(e.data.type==='smilex-render-annotations'){
      renderMarkers(e.data.annotations||[],e.data.activePage,e.data.selectedId||null);
    }
    if(e.data.type==='smilex-select-annotation'){
      document.querySelectorAll('.smilex-marker-active').forEach(function(m){m.classList.remove('smilex-marker-active');});
      if(e.data.id){
        var m=document.querySelector('.smilex-marker[data-ann-id="'+e.data.id+'"]');
        if(m)m.classList.add('smilex-marker-active');
      }
    }
    if(e.data.type==='smilex-start-placing'){
      enterPlacing();
    }
    if(e.data.type==='smilex-cancel-placing'){
      exitPlacing();
    }
  });
})();
</script>`

export const SandboxRenderer = forwardRef<SandboxRendererHandle, SandboxRendererProps>(
  function SandboxRenderer({ htmlCode, onContentReady, onPagesDiscovered, onActivePageChange, onAnnotationClick, onAnnotationPlaced }, ref) {
    const iframeRef = useRef<HTMLIFrameElement>(null)

    useImperativeHandle(ref, () => ({
      navigateToPage(page: string) {
        iframeRef.current?.contentWindow?.postMessage(
          { type: 'smilex-navigate', page },
          '*',
        )
      },
      renderAnnotations(annotations: Annotation[], activePage: string | null, selectedId: string | null) {
        iframeRef.current?.contentWindow?.postMessage(
          { type: 'smilex-render-annotations', annotations, activePage, selectedId },
          '*',
        )
      },
      startPlacing() {
        iframeRef.current?.contentWindow?.postMessage(
          { type: 'smilex-start-placing' },
          '*',
        )
      },
      cancelPlacing() {
        iframeRef.current?.contentWindow?.postMessage(
          { type: 'smilex-cancel-placing' },
          '*',
        )
      },
    }))

    useEffect(() => {
      const iframe = iframeRef.current
      if (!iframe || !htmlCode) return

      const wrapped = htmlCode.replace(
        '</head>',
        `${BRIDGE_SCRIPT}</head>`,
      )
      iframe.srcdoc = wrapped
    }, [htmlCode])

    useEffect(() => {
      const handler = (e: MessageEvent) => {
        const d = e.data
        if (!d?.type) return

        if (d.type === 'smilex-bridge-init') {
          onPagesDiscovered?.(d.pages ?? [])
          onActivePageChange?.(d.activePage ?? null)
          onContentReady?.()
        } else if (d.type === 'smilex-page-change') {
          onActivePageChange?.(d.activePage ?? null)
        } else if (d.type === 'smilex-annotation-click') {
          onAnnotationClick?.(d.id)
        } else if (d.type === 'smilex-annotation-placed') {
          onAnnotationPlaced?.(d.selector, d.page)
        }
      }
      window.addEventListener('message', handler)
      return () => window.removeEventListener('message', handler)
    }, [onPagesDiscovered, onActivePageChange, onContentReady, onAnnotationClick, onAnnotationPlaced])

    if (!htmlCode) return null

    return (
      <iframe
        ref={iframeRef}
        sandbox="allow-scripts allow-same-origin allow-forms"
        title="Prototype Preview"
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
          backgroundColor: '#fff',
        }}
      />
    )
  },
)
