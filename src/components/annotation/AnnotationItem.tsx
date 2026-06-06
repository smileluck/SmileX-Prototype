import { Trash2 } from 'lucide-react'
import type { Annotation } from '../../types'

interface AnnotationItemProps {
  annotation: Annotation
  onUpdate: (id: string, description: string) => void
  onDelete: (id: string) => void
  onSelect: (id: string) => void
  active: boolean
}

export function AnnotationItem({ annotation, onUpdate, onDelete, onSelect, active }: AnnotationItemProps) {
  return (
    <div
      onClick={() => onSelect(annotation.id)}
      className={`card card-compact bg-base-200 cursor-pointer transition-all ${
        active ? 'ring-2 ring-primary' : 'hover:bg-base-300'
      }`}
    >
      <div className="card-body flex-row items-start gap-3">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
          {annotation.markerNumber}
        </div>
        <div className="flex-1">
          <textarea
            className="textarea textarea-bordered textarea-sm w-full text-sm"
            placeholder="输入注解说明..."
            rows={2}
            value={annotation.description}
            onChange={(e) => onUpdate(annotation.id, e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
        <button
          className="btn btn-ghost btn-xs text-error"
          onClick={(e) => {
            e.stopPropagation()
            onDelete(annotation.id)
          }}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  )
}
