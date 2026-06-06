import { useRef, useEffect } from 'react'

interface SandboxRendererProps {
  htmlCode: string
  onContentReady?: () => void
}

export function SandboxRenderer({ htmlCode, onContentReady }: SandboxRendererProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    const iframe = iframeRef.current
    if (!iframe || !htmlCode) return

    // Wrap user HTML with error catching that reports to parent
    const wrapped = htmlCode.replace(
      '<head>',
      `<head><script>
window.addEventListener('error', function(e) {
  try { window.parent.postMessage({type:'iframe-error', msg:e.message, file:e.filename, line:e.lineno}, '*'); } catch(x){}
});
window.addEventListener('unhandledrejection', function(e) {
  try { window.parent.postMessage({type:'iframe-error', msg:'Promise: '+e.reason}, '*'); } catch(x){}
});
</script>`
    )

    iframe.srcdoc = wrapped
  }, [htmlCode])

  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.type === 'iframe-error') {
        console.error('[SandboxRenderer] iframe JS error:', e.data.msg, e.data.file, e.data.line)
      }
    }
    window.addEventListener('message', handler)
    return () => window.removeEventListener('message', handler)
  }, [])

  if (!htmlCode) return null

  return (
    <iframe
      ref={iframeRef}
      sandbox="allow-scripts allow-same-origin allow-forms"
      title="Prototype Preview"
      onLoad={onContentReady}
      style={{
        width: '100%',
        height: '100%',
        border: 'none',
        backgroundColor: '#fff',
      }}
    />
  )
}
