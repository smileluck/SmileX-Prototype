import { useState, useEffect, useRef, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, Maximize } from 'lucide-react'
import { listImages } from '../../services/storage'

interface FlowchartModalProps {
  slug: string
  onClose: () => void
}

interface DiagramItem {
  name: string
  url: string
  type: 'image' | 'mermaid'
  mermaidCode?: string
  title?: string
}

function extractMermaidCode(md: string): string {
  const match = md.match(/```mermaid\n([\s\S]*?)```/)
  if (!match) return ''
  let code = match[1].trim()
  let isOpen = true
  code = code.replace(/["""]/g, () => {
    const ch = isOpen ? '「' : '」'
    isOpen = !isOpen
    return ch
  })
  return code
}

function extractTitle(md: string): string {
  const match = md.match(/^#\s+(.+)$/m)
  return match ? match[1].trim() : ''
}

function loadMermaid(): Promise<void> {
  if ((window as any).mermaid) return Promise.resolve()
  return new Promise((resolve, reject) => {
    const s = document.createElement('script')
    s.src = 'https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js'
    s.onload = () => {
      ;(window as any).mermaid.initialize({
        startOnLoad: false,
        theme: 'default',
        securityLevel: 'loose',
      })
      resolve()
    }
    s.onerror = reject
    document.head.appendChild(s)
  })
}

function MermaidDiagram({ code, onRendered }: { code: string; onRendered?: () => void }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    setError(null)

    loadMermaid()
      .then(async () => {
        if (cancelled || !containerRef.current) return
        const mermaid = (window as any).mermaid
        const id = `mermaid-${Math.random().toString(36).slice(2, 10)}`
        try {
          const { svg } = await mermaid.render(id, code)
          if (!cancelled && containerRef.current) {
            containerRef.current.innerHTML = svg
          }
        } catch (e: any) {
          if (!cancelled) setError(e.message || '渲染失败')
        }
      })
      .catch(() => {
        if (!cancelled) setError('无法加载 Mermaid 库，请检查网络连接')
      })
      .finally(() => {
        if (!cancelled) {
          setLoading(false)
          onRendered?.()
        }
      })

    return () => { cancelled = true }
  }, [code])

  if (error) {
    return <div className="text-error text-sm p-4">{error}</div>
  }

  return (
    <div className="w-full min-h-0">
      {loading && <span className="loading loading-spinner loading-md" />}
      <div
        ref={containerRef}
        className={loading ? 'hidden' : '[&>svg]:w-full [&>svg]:h-auto'}
      />
    </div>
  )
}

/** Hidden pre-renderer to warm up adjacent Mermaid diagrams */
function MermaidPreload({ code }: { code: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    loadMermaid().then(async () => {
      if (cancelled || !ref.current) return
      const mermaid = (window as any).mermaid
      const id = `mermaid-pre-${Math.random().toString(36).slice(2, 10)}`
      try {
        const { svg } = await mermaid.render(id, code)
        if (!cancelled && ref.current) {
          ref.current.innerHTML = svg
        }
      } catch { /* ignore preload errors */ }
    })
    return () => { cancelled = true }
  }, [code])

  return <div ref={ref} className="hidden" />
}

function ImageWithLoading({ src, alt, onLoaded }: { src: string; alt: string; onLoaded?: () => void }) {
  const [loading, setLoading] = useState(true)

  return (
    <div className="relative">
      {loading && (
        <div className="flex items-center justify-center py-20">
          <span className="loading loading-spinner loading-md" />
        </div>
      )}
      <img
        src={src}
        alt={alt}
        className={`max-w-full rounded-lg transition-opacity duration-200 ${loading ? 'opacity-0 absolute' : 'opacity-100'}`}
        onLoad={() => {
          setLoading(false)
          onLoaded?.()
        }}
      />
    </div>
  )
}

const MIN_SCALE = 0.2
const MAX_SCALE = 5
const ZOOM_STEP = 0.15

export function FlowchartModal({ slug, onClose }: FlowchartModalProps) {
  const [items, setItems] = useState<DiagramItem[]>([])
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(true)
  const [rendering, setRendering] = useState(true)
  const [scale, setScale] = useState(1)
  const [translate, setTranslate] = useState({ x: 0, y: 0 })
  const dragging = useRef(false)
  const lastPos = useRef({ x: 0, y: 0 })
  const viewportRef = useRef<HTMLDivElement>(null)

  const resetView = useCallback(() => {
    setScale(1)
    setTranslate({ x: 0, y: 0 })
  }, [])

  const loadItems = useCallback(async () => {
    const imgs = await listImages(slug)
    const result: DiagramItem[] = []

    for (const img of imgs) {
      const ext = img.name.split('.').pop()?.toLowerCase()
      if (ext === 'md') {
        try {
          const resp = await fetch(img.url)
          const text = await resp.text()
          const code = extractMermaidCode(text)
          if (code) {
            result.push({
              ...img,
              type: 'mermaid',
              mermaidCode: code,
              title: extractTitle(text),
            })
          }
        } catch { /* skip unreadable files */ }
      } else {
        result.push({ ...img, type: 'image' })
      }
    }

    result.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'mermaid' ? -1 : 1
      return a.name.localeCompare(b.name)
    })

    setItems(result)
    setLoading(false)
  }, [slug])

  useEffect(() => { loadItems() }, [loadItems])

  const onItemRendered = useCallback(() => {
    setRendering(false)
  }, [])

  const switchTo = useCallback((index: number) => {
    setRendering(true)
    resetView()
    setCurrent(index)
  }, [resetView])

  const prev = () => switchTo(current > 0 ? current - 1 : items.length - 1)
  const next = () => switchTo(current < items.length - 1 ? current + 1 : 0)

  const zoomTo = useCallback((newScale: number, pivotX?: number, pivotY?: number) => {
    setScale(prev => {
      const clamped = Math.min(MAX_SCALE, Math.max(MIN_SCALE, newScale))
      if (pivotX !== undefined && pivotY !== undefined) {
        const ratio = clamped / prev
        setTranslate(t => ({
          x: pivotX - ratio * (pivotX - t.x),
          y: pivotY - ratio * (pivotY - t.y),
        }))
      }
      return clamped
    })
  }, [])

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect()
    const pivotX = e.clientX - rect.left
    const pivotY = e.clientY - rect.top
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP
    zoomTo(scale * (1 + delta), pivotX, pivotY)
  }, [scale, zoomTo])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return
    dragging.current = true
    lastPos.current = { x: e.clientX, y: e.clientY }
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging.current) return
    const dx = e.clientX - lastPos.current.x
    const dy = e.clientY - lastPos.current.y
    lastPos.current = { x: e.clientX, y: e.clientY }
    setTranslate(t => ({ x: t.x + dx, y: t.y + dy }))
  }, [])

  const handleMouseUp = useCallback(() => {
    dragging.current = false
  }, [])

  const displayName = (item: DiagramItem) =>
    item.title || item.name.replace(/\.(md|png|jpg|jpeg|gif|svg|webp)$/i, '')

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-6xl w-full h-[85vh] flex flex-col p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-base-300">
          <h3 className="font-bold text-lg">流程图预览</h3>
          <div className="flex items-center gap-1">
            <div className="join mr-2">
              <button
                className="join-item btn btn-sm btn-ghost"
                onClick={() => zoomTo(scale * (1 + ZOOM_STEP))}
                disabled={scale >= MAX_SCALE}
                title="放大"
              >
                <ZoomIn className="h-4 w-4" />
              </button>
              <button className="join-item btn btn-sm btn-ghost no-animation w-16" disabled>
                {Math.round(scale * 100)}%
              </button>
              <button
                className="join-item btn btn-sm btn-ghost"
                onClick={() => zoomTo(scale / (1 + ZOOM_STEP))}
                disabled={scale <= MIN_SCALE}
                title="缩小"
              >
                <ZoomOut className="h-4 w-4" />
              </button>
              <button
                className="join-item btn btn-sm btn-ghost"
                onClick={resetView}
                title="重置"
              >
                <Maximize className="h-4 w-4" />
              </button>
            </div>
            <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}>
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div
          ref={viewportRef}
          className="flex-1 overflow-hidden relative min-h-0"
          style={{ cursor: dragging.current ? 'grabbing' : 'grab' }}
          onWheel={handleWheel}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : items.length === 0 ? (
            <div className="flex items-center justify-center h-full text-base-content/50">
              <div className="text-center">
                <p className="text-lg">暂无流程图</p>
                <p className="text-sm mt-1">将流程图（.md 或图片）放入 website/{slug}/images/ 目录</p>
              </div>
            </div>
          ) : (
            <>
              {items.length > 1 && (
                <button
                  className="btn btn-circle btn-sm btn-ghost absolute left-2 top-1/2 -translate-y-1/2 z-20 bg-base-100/60"
                  onClick={prev}
                >
                  <ChevronLeft className="h-5 w-5" />
                </button>
              )}
              <div
                className="w-full h-full"
                style={{
                  transform: `translate(${translate.x}px, ${translate.y}px) scale(${scale})`,
                  transformOrigin: '0 0',
                }}
              >
                <div className="flex flex-col items-center gap-2 w-full p-4">
                  {items[current].type === 'mermaid' ? (
                    <MermaidDiagram code={items[current].mermaidCode!} onRendered={onItemRendered} />
                  ) : (
                    <ImageWithLoading src={items[current].url} alt={items[current].name} onLoaded={onItemRendered} />
                  )}
                </div>
              </div>
              {rendering && (
                <div className="absolute inset-0 flex items-center justify-center bg-base-100/40 z-10 pointer-events-none">
                  <span className="loading loading-spinner loading-lg" />
                </div>
              )}
              {items.length > 1 && (
                <button
                  className="btn btn-circle btn-sm btn-ghost absolute right-2 top-1/2 -translate-y-1/2 z-20 bg-base-100/60"
                  onClick={next}
                >
                  <ChevronRight className="h-5 w-5" />
                </button>
              )}
              <span className="absolute bottom-2 left-1/2 -translate-x-1/2 text-sm text-base-content/60 z-20 bg-base-100/60 px-2 rounded">
                {current + 1} / {items.length} — {displayName(items[current])}
              </span>
              {/* Preload adjacent items */}
              {items.length > 1 && items[current > 0 ? current - 1 : items.length - 1]?.type === 'mermaid' && (
                <MermaidPreload code={items[current > 0 ? current - 1 : items.length - 1].mermaidCode!} />
              )}
              {items.length > 1 && items[current < items.length - 1 ? current + 1 : 0]?.type === 'mermaid' && (
                <MermaidPreload code={items[current < items.length - 1 ? current + 1 : 0].mermaidCode!} />
              )}
            </>
          )}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  )
}
