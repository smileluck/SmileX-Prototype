import { useMemo } from 'react'
import type { Annotation, PageInfo } from '../../types'
import { AnnotationItem } from '../annotation/AnnotationItem'
import { EmptyState } from '../shared/EmptyState'
import { MessageSquare, Layers } from 'lucide-react'

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

  const groups = useMemo(() => {
    const result: { key: string; name: string; annotations: Annotation[] }[] = []
    const byPage = new Map<string, Annotation[]>()

    for (const ann of annotations) {
      const key = ann.page ?? ''
      let list = byPage.get(key)
      if (!list) { list = []; byPage.set(key, list) }
      list.push(ann)
    }

    if (pages.length === 0) {
      const all = byPage.get('') ?? []
      if (all.length > 0) result.push({ key: '', name: '标注', annotations: all })
      for (const [key, list] of byPage) {
        if (key !== '') result.push({ key, name: key, annotations: list })
      }
      return result
    }

    for (const p of pages) {
      const list = byPage.get(p.id)
      if (list && list.length > 0) {
        result.push({ key: p.id, name: p.name, annotations: list })
      }
    }

    const ungrouped = byPage.get('')
    if (ungrouped && ungrouped.length > 0) {
      result.push({ key: '', name: '未分组', annotations: ungrouped })
    }

    for (const [key, list] of byPage) {
      if (key === '' || pages.some(p => p.id === key)) continue
      result.push({ key, name: key, annotations: list })
    }

    return result
  }, [annotations, pages])

  return (
    <div className="flex flex-col h-full bg-base-200">
      <div className="p-3 border-b border-base-300">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          标注列表 ({annotations.length})
        </h3>
      </div>

      {pages.length > 0 && (
        <div className="border-b border-base-300 px-3 py-2">
          <div className="flex items-center gap-1.5 text-xs font-medium text-base-content/50 mb-1.5">
            <Layers className="h-3.5 w-3.5" />
            页面导航
          </div>
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

      <div className="flex-1 overflow-y-auto">
        {(() => {
          const currentAnnotations = activePage
            ? annotations.filter(a => a.page === activePage)
            : annotations
          return currentAnnotations.length === 0 ? (
            <div className="p-2">
              <EmptyState text="当前页面暂无标注，点击「添加标注」按钮开始" />
            </div>
          ) : (
            <div className="space-y-1.5 p-2">
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
          )
        })()}
      </div>
    </div>
  )
}
