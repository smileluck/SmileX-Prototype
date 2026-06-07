import { useRef, useEffect } from 'react'
import type { Annotation } from '../../types'

const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#14b8a6', '#f97316']

interface AnnotationItemProps {
  annotation: Annotation
  onUpdate: (id: string, description: string) => void
  onDelete: (id: string) => void
  onSelect: (id: string) => void
  onConfirm: () => void
  active: boolean
  pending: boolean
  readOnly?: boolean
}

export function AnnotationItem({ annotation, onUpdate, onDelete, onSelect, onConfirm, active, pending, readOnly }: AnnotationItemProps) {
  const color = COLORS[(annotation.markerNumber - 1) % COLORS.length]
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    if (active && !annotation.description && textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [active, annotation.description])

  return (
    <div
      data-ann-id={annotation.id}
      onClick={() => onSelect(annotation.id)}
      className={`group relative rounded-lg border transition-all cursor-pointer ${
        active
          ? 'border-current/30 bg-base-100 shadow-sm'
          : 'border-transparent hover:bg-base-200/60'
      }`}
      style={active ? { borderColor: color + '40' } : undefined}
    >
      {/* Action buttons - top right */}
      {!readOnly && (
        <div className="absolute -top-2 -right-2 flex items-center gap-0.5 z-10">
          {pending && (
            <button
              className="flex items-center justify-center w-5 h-5 rounded-full bg-success text-white text-xs font-bold leading-none shadow-sm transition-colors"
              onClick={(e) => {
                e.stopPropagation()
                if (!annotation.description.trim()) {
                  alert('请先填写标注说明')
                  return
                }
                onConfirm()
              }}
            >
              ✓
            </button>
          )}
          <button
            className={`flex items-center justify-center w-5 h-5 rounded-full bg-base-300 text-base-content/50 hover:bg-error hover:text-white text-xs font-bold leading-none shadow-sm transition-colors ${
              active || pending ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
            }`}
            onClick={(e) => {
              e.stopPropagation()
              onDelete(annotation.id)
            }}
          >
            ✕
          </button>
        </div>
      )}

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
          {readOnly ? (
            <p className="text-xs leading-relaxed text-base-content/80 whitespace-pre-wrap">
              {annotation.description || '未添加说明'}
            </p>
          ) : (
            <textarea
              ref={textareaRef}
              className="textarea textarea-xs w-full text-xs leading-relaxed border-0 bg-transparent p-0 focus:bg-base-100 focus:outline-none focus:rounded resize-none"
              placeholder="添加说明..."
              rows={annotation.description ? undefined : 1}
              value={annotation.description}
              onChange={(e) => onUpdate(annotation.id, e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
          )}
        </div>
      </div>
    </div>
  )
}
