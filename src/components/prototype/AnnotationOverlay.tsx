interface AnnotationOverlayProps {
  isPlacing: boolean
  onStartPlacing: () => void
  onCancelPlacing: () => void
}

export function AnnotationOverlay({
  isPlacing,
  onStartPlacing,
}: AnnotationOverlayProps) {
  if (isPlacing) return null

  return (
    <button
      onClick={(e) => {
        e.stopPropagation()
        onStartPlacing()
      }}
      style={{ pointerEvents: 'auto' }}
      className="btn btn-sm absolute top-2 right-2 z-20 btn-ghost bg-base-100/80"
    >
      添加标注
    </button>
  )
}
