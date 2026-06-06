import type { Annotation } from '../../types'
import { AnnotationItem } from '../annotation/AnnotationItem'
import { EmptyState } from '../shared/EmptyState'
import { MessageSquare } from 'lucide-react'

interface AnnotationSidebarProps {
  annotations: Annotation[]
  selectedId: string | null
  onUpdate: (id: string, description: string) => void
  onDelete: (id: string) => void
  onSelect: (id: string) => void
}

export function AnnotationSidebar({
  annotations,
  selectedId,
  onUpdate,
  onDelete,
  onSelect,
}: AnnotationSidebarProps) {
  return (
    <div className="flex flex-col h-full bg-base-200">
      <div className="p-3 border-b border-base-300">
        <h3 className="font-semibold text-sm flex items-center gap-2">
          <MessageSquare className="h-4 w-4" />
          注解列表 ({annotations.length})
        </h3>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-2">
        {annotations.length === 0 ? (
          <EmptyState text="点击「添加标注」按钮，然后在界面上点击放置标记" />
        ) : (
          annotations.map(ann => (
            <AnnotationItem
              key={ann.id}
              annotation={ann}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onSelect={onSelect}
              active={selectedId === ann.id}
            />
          ))
        )}
      </div>
    </div>
  )
}
