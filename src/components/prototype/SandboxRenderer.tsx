import { useRef, useEffect, forwardRef, useImperativeHandle } from 'react'
import type { PageInfo } from '../../types'

interface SandboxRendererProps {
  htmlCode: string
  onContentReady?: () => void
  onPagesDiscovered?: (pages: PageInfo[]) => void
  onActivePageChange?: (page: string | null) => void
}

export interface SandboxRendererHandle {
  navigateToPage: (page: string) => void
}

const BRIDGE_SCRIPT = `<script>
(function(){
  var _standalone=[];
  function discoverPages(){
    var pages=[];
    var names={};
    try{if(typeof pageNames!=='undefined')names=pageNames;}catch(e){}
    document.querySelectorAll('.page-section').forEach(function(s){
      var id=s.id.replace('page-','');
      var name=names[id];
      if(!name){var nav=document.querySelector('.nav-item[data-page="'+id+'"]');name=nav?nav.textContent.trim():id;}
      pages.push({id:id,name:name});
    });
    _standalone=[];
    document.querySelectorAll('body > [id]').forEach(function(el){
      if(el.classList.contains('page-section'))return;
      if(el.querySelector('.page-section'))return;
      var heading=el.querySelector('h1,h2,h3');
      var name=el.getAttribute('data-page-name')||(heading?heading.textContent.trim():el.id);
      _standalone.push(el);
      pages.push({id:el.id,name:name});
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
        document.querySelectorAll('.page-section').forEach(function(p){p.classList.remove('active');});
        el.classList.add('active');
        document.querySelectorAll('.nav-item').forEach(function(n){n.classList.remove('active');});
        var nav=document.querySelector('.nav-item[data-page="'+target+'"]');
        if(nav)nav.classList.add('active');
        var title=document.getElementById('pageTitle');
        if(title){try{if(typeof pageNames!=='undefined')title.textContent=pageNames[target]||target;}catch(e){}}
      }
    }
  });
})();
</script>`

export const SandboxRenderer = forwardRef<SandboxRendererHandle, SandboxRendererProps>(
  function SandboxRenderer({ htmlCode, onContentReady, onPagesDiscovered, onActivePageChange }, ref) {
    const iframeRef = useRef<HTMLIFrameElement>(null)

    useImperativeHandle(ref, () => ({
      navigateToPage(page: string) {
        iframeRef.current?.contentWindow?.postMessage(
          { type: 'smilex-navigate', page },
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
        }
      }
      window.addEventListener('message', handler)
      return () => window.removeEventListener('message', handler)
    }, [onPagesDiscovered, onActivePageChange, onContentReady])

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
