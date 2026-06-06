import { useMemo } from 'react'
import type { Annotation, PageInfo } from '../../types'
import { AnnotationItem } from '../annotation/AnnotationItem'
import { EmptyState } from '../shared/EmptyState'
import { MessageSquare, ChevronDown } from 'lucide-react'

interface AnnotationSidebarProps {
  annotations: Annotation[]
  pages: PageInfo[]
  activePage: string | null
  selectedId: string | null
  onUpdate: (id: string, description: string) => void
  onDelete: (id: string) => void
  onSelect: (id: string) => void
}

export function AnnotationSidebar({
  annotations,
  pages,
  activePage,
  selectedId,
  onUpdate,
  onDelete,
  onSelect,
}: AnnotationSidebarProps) {
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
                <ChevronDown className="h-3 w-3" />
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
