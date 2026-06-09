import { useState, useRef, useEffect } from 'react'
import { Undo2, Redo2, Plus, X, History } from 'lucide-react'
import type { HistoryEntry } from '../../hooks/useUndoHistory'
import type { Annotation } from '../../types'

interface OperationToolbarProps {
  canUndo: boolean
  canRedo: boolean
  history: HistoryEntry<Annotation[]>[]
  onUndo: () => void
  onRedo: () => void
  onJumpTo: (index: number) => void
  onAddAnnotation: () => void
  onCancelPlacing: () => void
  isPlacing: boolean
}

function formatTime(ts: number) {
  const d = new Date(ts)
  return d.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

export function OperationToolbar({
  canUndo,
  canRedo,
  history,
  onUndo,
  onRedo,
  onJumpTo,
  onAddAnnotation,
  onCancelPlacing,
  isPlacing,
}: OperationToolbarProps) {
  const [showHistory, setShowHistory] = useState(false)
  const historyRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showHistory) return
    const handler = (e: MouseEvent) => {
      if (historyRef.current && !historyRef.current.contains(e.target as Node)) {
        setShowHistory(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [showHistory])

  return (
    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20" ref={historyRef}>
      {showHistory && history.length > 0 && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 bg-base-100 border border-base-300 rounded-lg shadow-xl min-w-[200px] max-h-[280px] overflow-y-auto py-1">
          {[...history].reverse().map((entry, ri) => {
            const index = history.length - 1 - ri
            return (
              <div
                key={entry.timestamp}
                className="px-3 py-1.5 text-xs hover:bg-base-200 cursor-pointer flex items-center gap-2"
                onClick={() => {
                  onJumpTo(index)
                  setShowHistory(false)
                }}
              >
                <span className="text-base-content/40">{formatTime(entry.timestamp)}</span>
                <span className="truncate">{entry.label}</span>
              </div>
            )
          })}
        </div>
      )}

      <div className="flex items-center gap-0.5 bg-base-100/90 backdrop-blur-sm border border-base-300 rounded-full shadow-lg px-1.5 py-1">
        <button
          className="btn btn-sm btn-ghost btn-circle"
          disabled={!canUndo}
          onClick={onUndo}
          title="撤销 (Ctrl+Z)"
        >
          <Undo2 className="w-4 h-4" />
        </button>
        <button
          className="btn btn-sm btn-ghost btn-circle"
          disabled={!canRedo}
          onClick={onRedo}
          title="重做 (Ctrl+Shift+Z)"
        >
          <Redo2 className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-base-300 mx-0.5" />

        <button
          className={`btn btn-sm btn-ghost btn-circle ${isPlacing ? 'text-primary' : ''}`}
          onClick={isPlacing ? onCancelPlacing : onAddAnnotation}
          title={isPlacing ? '取消放置' : '添加标注'}
        >
          {isPlacing ? <X className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
        </button>

        <div className="w-px h-5 bg-base-300 mx-0.5" />

        <button
          className={`btn btn-sm btn-ghost btn-circle ${showHistory ? 'text-primary' : ''}`}
          onClick={() => setShowHistory(v => !v)}
          disabled={history.length === 0}
          title="操作历史"
        >
          <History className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}
