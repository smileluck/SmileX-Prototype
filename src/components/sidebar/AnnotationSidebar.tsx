import { useMemo, useState, useEffect, useRef } from 'react'
import type { Annotation, PageInfo } from '../../types'
import { AnnotationItem } from '../annotation/AnnotationItem'
import { EmptyState } from '../shared/EmptyState'
import { Layers } from 'lucide-react'

interface AnnotationSidebarProps {
  annotations: Annotation[]
  pages: PageInfo[]
  activePage: string | null
  selectedId: string | null
  onUpdate: (id: string, description: string) => void
  onDelete: (id: string) => void
  onSelect: (id: string) => void
  onNavigate?: (page: string) => void
}

export function AnnotationSidebar({
  annotations,
  pages,
  activePage,
  selectedId,
  onUpdate,
  onDelete,
  onSelect,
  onNavigate,
}: AnnotationSidebarProps) {
  const [tab, setTab] = useState<'page' | 'global'>('page')
  const listRef = useRef<HTMLDivElement>(null)

  // Auto-switch tab when selectedId changes (e.g. marker click in iframe)
  useEffect(() => {
    if (!selectedId) return
    const ann = annotations.find(a => a.id === selectedId)
    if (!ann) return
    const correctTab = ann.scope === 'global' ? 'global' : 'page'
    if (tab !== correctTab) setTab(correctTab)
  }, [selectedId, annotations, tab])

  const globalAnnotations = useMemo(
    () => annotations.filter(a => a.scope === 'global'),
    [annotations],
  )

  const pageAnnotationCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const ann of annotations) {
      if (ann.scope === 'global') continue
      const key = ann.page ?? ''
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }
    return counts
  }, [annotations])

  const pageAnnotations = useMemo(
    () => activePage
      ? annotations.filter(a => a.scope !== 'global' && a.page === activePage)
      : annotations.filter(a => a.scope !== 'global'),
    [annotations, activePage],
  )

  const displayedAnnotations = tab === 'global' ? globalAnnotations : pageAnnotations

  // Scroll selected item into view
  useEffect(() => {
    if (!selectedId || !listRef.current) return
    const frame = requestAnimationFrame(() => {
      const el = listRef.current?.querySelector(`[data-ann-id="${selectedId}"]`)
      el?.scrollIntoView({ block: 'nearest', behavior: 'smooth' })
    })
    return () => cancelAnimationFrame(frame)
  }, [selectedId, tab, displayedAnnotations.length])

  return (
    <div className="flex flex-col h-full bg-base-200">
      {/* Tab bar */}
      <div role="tablist" className="tabs tabs-bordered px-3 pt-2">
        <button
          role="tab"
          className={`tab text-xs ${tab === 'page' ? 'tab-active' : ''}`}
          onClick={() => setTab('page')}
        >
          页面
          {pageAnnotations.length > 0 && (
            <span className="badge badge-xs ml-1">{pageAnnotations.length}</span>
          )}
        </button>
        <button
          role="tab"
          className={`tab text-xs ${tab === 'global' ? 'tab-active' : ''}`}
          onClick={() => setTab('global')}
        >
          通用
          {globalAnnotations.length > 0 && (
            <span className="badge badge-xs ml-1">{globalAnnotations.length}</span>
          )}
        </button>
      </div>

      {/* Page navigation dropdown — only in page tab */}
      {tab === 'page' && pages.length > 0 && (
        <div className="px-3 py-2.5 border-b border-base-300">
          <label className="flex items-center gap-1.5 text-[11px] font-medium text-base-content/40 uppercase tracking-wider mb-1.5">
            <Layers className="h-3 w-3" />
            页面
          </label>
          <select
            className="select select-sm select-bordered w-full text-sm"
            value={activePage ?? ''}
            onChange={(e) => onNavigate?.(e.target.value)}
          >
            {pages.map(page => (
              <option key={page.id} value={page.id}>
                {page.name}{pageAnnotationCounts.has(page.id) ? ` (${pageAnnotationCounts.get(page.id)})` : ''}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Annotation list */}
      <div className="flex-1 overflow-y-auto">
        {displayedAnnotations.length === 0 ? (
          <div className="p-3">
            <EmptyState text={tab === 'global' ? '暂无通用标注' : '当前页面暂无标注'} />
          </div>
        ) : (
          <div className="flex flex-col p-2 gap-0.5" ref={listRef}>
            {displayedAnnotations.map(ann => (
              <AnnotationItem
                key={ann.id}
                annotation={ann}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onSelect={onSelect}
                active={selectedId === ann.id}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
