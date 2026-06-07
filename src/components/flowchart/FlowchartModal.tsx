import { useState, useEffect, useRef, useCallback } from 'react'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
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
  // Double quotes inside node labels break Mermaid parser — replace with corner brackets
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

function MermaidDiagram({ code }: { code: string }) {
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
        if (!cancelled) setLoading(false)
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

export function FlowchartModal({ slug, onClose }: FlowchartModalProps) {
  const [items, setItems] = useState<DiagramItem[]>([])
  const [current, setCurrent] = useState(0)
  const [loading, setLoading] = useState(true)

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

    // Sort: mermaid diagrams first (by name), then images
    result.sort((a, b) => {
      if (a.type !== b.type) return a.type === 'mermaid' ? -1 : 1
      return a.name.localeCompare(b.name)
    })

    setItems(result)
    setLoading(false)
  }, [slug])

  useEffect(() => { loadItems() }, [loadItems])

  const prev = () => setCurrent(i => (i > 0 ? i - 1 : items.length - 1))
  const next = () => setCurrent(i => (i < items.length - 1 ? i + 1 : 0))

  const displayName = (item: DiagramItem) =>
    item.title || item.name.replace(/\.(md|png|jpg|jpeg|gif|svg|webp)$/i, '')

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-6xl w-full h-[85vh] flex flex-col p-0">
        <div className="flex items-center justify-between px-4 py-3 border-b border-base-300">
          <h3 className="font-bold text-lg">流程图预览</h3>
          <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}>
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-auto relative min-h-0">
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
            <div className="relative min-h-full flex flex-col items-center p-4">
              {items.length > 1 && (
                <button className="btn btn-circle btn-sm btn-ghost absolute left-1 top-1/2 -translate-y-1/2 z-10" onClick={prev}>
                  <ChevronLeft className="h-5 w-5" />
                </button>
              )}
              <div className="flex flex-col items-center gap-2 w-full max-w-full px-6">
                {items[current].type === 'mermaid' ? (
                  <MermaidDiagram code={items[current].mermaidCode!} />
                ) : (
                  <img
                    src={items[current].url}
                    alt={items[current].name}
                    className="max-w-full max-h-[70vh] object-contain rounded-lg"
                  />
                )}
                <span className="text-sm text-base-content/60">
                  {current + 1} / {items.length} — {displayName(items[current])}
                </span>
              </div>
              {items.length > 1 && (
                <button className="btn btn-circle btn-sm btn-ghost absolute right-1 top-1/2 -translate-y-1/2 z-10" onClick={next}>
                  <ChevronRight className="h-5 w-5" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  )
}
