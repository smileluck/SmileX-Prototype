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
        <div className="border-b border-base-300">
          <div className="px-3 py-2 flex items-center gap-1.5 text-xs font-medium text-base-content/50">
            <Layers className="h-3.5 w-3.5" />
            页面导航
          </div>
          <div className="px-2 pb-2 flex flex-col gap-0.5">
            {pages.map(page => (
              <button
                key={page.id}
                className={`btn btn-xs justify-start gap-2 font-normal ${
                  page.id === activePage
                    ? 'btn-primary'
                    : 'btn-ghost'
                }`}
                onClick={() => onNavigate?.(page.id)}
              >
                <span className="truncate">{page.name}</span>
                {pageAnnotationCounts.has(page.id) && (
                  <span className={`ml-auto text-[10px] rounded-full px-1.5 ${
                    page.id === activePage ? 'bg-primary-content/20 text-primary-content' : 'bg-base-300'
                  }`}>
                    {pageAnnotationCounts.get(page.id)}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-y-auto">
        {annotations.length === 0 ? (
          <div className="p-2">
            <EmptyState text="点击「添加标注」按钮，然后在界面上点击放置标记" />
          </div>
        ) : (
          groups.map(group => (
            <div key={group.key} className="px-2 pt-2">
              <div
                className={`flex items-center gap-1.5 px-2 py-1.5 rounded-md text-xs font-medium cursor-pointer transition-colors ${
                  group.key === activePage
                    ? 'bg-primary/10 text-primary'
                    : 'text-base-content/50 hover:bg-base-300'
                }`}
                onClick={() => {
                  const first = group.annotations[0]
                  if (first) onSelect(first.id)
                }}
              >
                {group.name}
                <span className="ml-auto opacity-60">{group.annotations.length}</span>
              </div>
              <div className="space-y-1.5 mt-1">
                {group.annotations.map(ann => (
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
            </div>
          ))
        )}
      </div>
    </div>
  )
}
