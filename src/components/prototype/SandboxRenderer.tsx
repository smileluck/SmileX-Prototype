import { useRef, useEffect } from 'react'

interface SandboxRendererProps {
  htmlCode: string
  onContentReady?: () => void
}

export function SandboxRenderer({ htmlCode, onContentReady }: SandboxRendererProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  useEffect(() => {
    if (iframeRef.current && htmlCode) {
      iframeRef.current.srcdoc = htmlCode
    }
  }, [htmlCode])

  if (!htmlCode) return null

  return (
    <iframe
      ref={iframeRef}
      sandbox="allow-scripts allow-same-origin"
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
