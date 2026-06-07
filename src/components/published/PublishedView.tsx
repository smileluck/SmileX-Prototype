import { useState, useCallback, useRef, useEffect } from 'react'
import { PrototypeView, type PrototypeViewHandle } from '../prototype/PrototypeView'
import { AnnotationSidebar } from '../sidebar/AnnotationSidebar'
import { loadPrototype } from '../../services/storage'
import { downloadPublishedHTML } from '../../utils/publish'
import { EmptyState } from '../shared/EmptyState'
import { LoadingSpinner } from '../shared/LoadingSpinner'
import { Download, Edit, Copy, Check } from 'lucide-react'
import type { Prototype, PageInfo } from '../../types'

interface PublishedViewProps {
  slug: string
  onOpenInEditor?: () => void
}

export function PublishedView({ slug, onOpenInEditor }: PublishedViewProps) {
  const [prototype, setPrototype] = useState<Prototype | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null)
  const [pages, setPages] = useState<PageInfo[]>([])
  const [activePage, setActivePage] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const prototypeViewRef = useRef<PrototypeViewHandle>(null)

  useEffect(() => {
    let cancelled = false
    loadPrototype(slug).then(p => {
      if (cancelled) return
      if (!p || !p.generatedCode) {
        setError('项目不存在或无原型内容')
      } else {
        setPrototype(p)
      }
      setLoading(false)
    }).catch(() => {
      if (!cancelled) {
        setError('加载失败')
        setLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [slug])

  const handleSelectAnnotation = useCallback((id: string) => {
    setSelectedAnnotationId(id)
    const ann = prototype?.annotations.find(a => a.id === id)
    if (ann && ann.scope === 'page' && ann.page) {
      prototypeViewRef.current?.navigateToPage(ann.page)
    }
    prototypeViewRef.current?.focusAnnotation(id)
  }, [prototype])

  const handleNavigate = useCallback((page: string) => {
    prototypeViewRef.current?.navigateToPage(page)
  }, [])

  const handleCopyLink = useCallback(() => {
    const url = new URL(window.location.href)
    url.searchParams.set('view', slug)
    url.searchParams.delete('edit')
    navigator.clipboard.writeText(url.toString()).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [slug])

  const handleExportHTML = useCallback(() => {
    if (prototype) downloadPublishedHTML(prototype)
  }, [prototype])

  if (loading) return <LoadingSpinner />
  if (error || !prototype) return <EmptyState text={error ?? '项目不存在'} />

  const annotations = prototype.annotations.filter(a => a.description.trim())

  return (
    <div className="flex flex-col h-full bg-base-100">
      <div className="navbar bg-base-100 border-b border-base-300 px-4 gap-2">
        <div className="flex-1 flex items-center gap-2">
          <span className="text-lg font-bold">SmileX Prototype</span>
          <span className="text-sm text-base-content/60 ml-2">/ {prototype.name}</span>
          <span className="badge badge-sm badge-ghost ml-1">预览</span>
        </div>
        <div className="flex-none flex items-center gap-2">
          <button className="btn btn-sm btn-ghost" onClick={handleCopyLink}>
            {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
            {copied ? '已复制' : '复制链接'}
          </button>
          <button className="btn btn-sm btn-ghost" onClick={handleExportHTML}>
            <Download className="h-4 w-4" /> 导出 HTML
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        <div className="flex-1 overflow-hidden relative">
          <PrototypeView
            ref={prototypeViewRef}
            prototype={prototype}
            onPlaceAnnotation={() => {}}
            selectedAnnotationId={selectedAnnotationId}
            hasPending={false}
            onSelectAnnotation={handleSelectAnnotation}
            onPagesChange={setPages}
            onActivePageChange={setActivePage}
            publishMode
          />
        </div>

        {annotations.length > 0 && (
          <div className="w-80 border-l border-base-300 hidden lg:block">
            <AnnotationSidebar
              annotations={annotations}
              pages={pages}
              activePage={activePage}
              selectedId={selectedAnnotationId}
              pendingId={null}
              onUpdate={() => {}}
              onDelete={() => {}}
              onSelect={handleSelectAnnotation}
              onConfirm={() => {}}
              onNavigate={handleNavigate}
              readOnly
            />
          </div>
        )}
      </div>
    </div>
  )
}
