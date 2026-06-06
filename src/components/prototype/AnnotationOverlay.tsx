import { useState, useCallback } from 'react'

interface AnnotationOverlayProps {
  isPlacing: boolean
  onStartPlacing: () => void
  onCancelPlacing: () => void
}

export function AnnotationOverlay({
  isPlacing,
  onStartPlacing,
  onCancelPlacing,
}: AnnotationOverlayProps) {
  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        if (isPlacing) onCancelPlacing()
        else onStartPlacing()
      }}
      style={{ pointerEvents: 'auto' }}
      className={`btn btn-sm absolute top-2 right-2 z-20 ${isPlacing ? 'btn-primary' : 'btn-ghost bg-base-100/80'}`}
    >
      {isPlacing ? '取消标注' : '添加标注'}
    </button>
  )
}
