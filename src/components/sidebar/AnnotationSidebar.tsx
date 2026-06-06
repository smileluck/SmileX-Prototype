import { useMemo } from 'react'
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
  const pageAnnotationCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const ann of annotations) {
      const key = ann.page ?? ''
      counts.set(key, (counts.get(key) ?? 0) + 1)
    }
    return counts
  }, [annotations])

  const currentAnnotations = useMemo(
    () => activePage ? annotations.filter(a => a.page === activePage) : annotations,
    [annotations, activePage],
  )

  return (
    <div className="flex flex-col h-full bg-base-200">
      {/* Page navigation dropdown */}
      {pages.length > 0 && (
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

      {/* Annotation list for current page */}
      <div className="flex-1 overflow-y-auto">
        {currentAnnotations.length === 0 ? (
          <div className="p-3">
            <EmptyState text="当前页面暂无标注" />
          </div>
        ) : (
          <div className="flex flex-col p-2 gap-0.5">
            {currentAnnotations.map(ann => (
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
