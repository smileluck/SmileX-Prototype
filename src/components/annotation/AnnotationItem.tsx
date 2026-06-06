import type { Annotation } from '../../types'

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']

interface AnnotationItemProps {
  annotation: Annotation
  onUpdate: (id: string, description: string) => void
  onDelete: (id: string) => void
  onSelect: (id: string) => void
  active: boolean
}

export function AnnotationItem({ annotation, onUpdate, onDelete, onSelect, active }: AnnotationItemProps) {
  const color = COLORS[(annotation.markerNumber - 1) % COLORS.length]

  return (
    <div
      onClick={() => onSelect(annotation.id)}
      className={`group relative rounded-lg border transition-all cursor-pointer ${
        active
          ? 'border-current/30 bg-base-100 shadow-sm'
          : 'border-transparent hover:bg-base-200/60'
      }`}
      style={active ? { borderColor: color + '40' } : undefined}
    >
      {/* Delete button - top right */}
      <button
        className={`absolute -top-2 -right-2 flex items-center justify-center w-5 h-5 rounded-full bg-base-300 text-base-content/50 hover:bg-error hover:text-white text-xs font-bold leading-none shadow-sm z-10 transition-colors ${
          active ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
        }`}
        onClick={(e) => {
          e.stopPropagation()
          onDelete(annotation.id)
        }}
      >
        ✕
      </button>

      <div className="flex items-start gap-2.5 p-2.5 pr-6">
        {/* Number badge */}
        <div
          className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white mt-0.5"
          style={{ backgroundColor: color }}
        >
          {annotation.markerNumber}
        </div>

        {/* Global indicator */}
        {annotation.scope === 'global' && (
          <span className="text-[9px] text-base-content/40 border border-base-content/20 rounded px-1 mt-1 shrink-0">通用</span>
        )}

        {/* Content */}
        <div className="flex-1 min-w-0">
          <textarea
            className="textarea textarea-xs w-full text-xs leading-relaxed border-0 bg-transparent p-0 focus:bg-base-100 focus:outline-none focus:rounded resize-none"
            placeholder="添加说明..."
            rows={annotation.description ? undefined : 1}
            value={annotation.description}
            onChange={(e) => onUpdate(annotation.id, e.target.value)}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      </div>
    </div>
  )
}
