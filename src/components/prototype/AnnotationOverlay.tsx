import { useState, useCallback, useRef, useMemo } from 'react'
import type { Annotation } from '../../types'
import { MarkerPin } from '../annotation/MarkerPin'

interface AnnotationOverlayProps {
  annotations: Annotation[]
  activePage: string | null
  onPlaceMarker: (x: number, y: number) => void
  selectedId: string | null
  onSelect: (id: string) => void
}

export function AnnotationOverlay({
  annotations,
  activePage,
  onPlaceMarker,
  selectedId,
  onSelect,
}: AnnotationOverlayProps) {
  const [isPlacing, setIsPlacing] = useState(false)
  const overlayRef = useRef<HTMLDivElement>(null)

  const visibleAnnotations = useMemo(
    () => annotations.filter(ann => !ann.page || ann.page === activePage),
    [annotations, activePage],
  )

  const handleClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPlacing || !overlayRef.current) return
    const rect = overlayRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width
    const y = (e.clientY - rect.top) / rect.height
    onPlaceMarker(x, y)
    setIsPlacing(false)
  }, [isPlacing, onPlaceMarker])

  return (
    <div
      ref={overlayRef}
      onClick={handleClick}
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 10,
        cursor: isPlacing ? 'crosshair' : 'default',
        pointerEvents: isPlacing ? 'auto' : 'none',
      }}
    >
      <button
        onClick={(e) => {
          e.stopPropagation()
          setIsPlacing(v => !v)
        }}
        style={{ pointerEvents: 'auto' }}
        className={`btn btn-sm absolute top-2 right-2 z-20 ${isPlacing ? 'btn-primary' : 'btn-ghost bg-base-100/80'}`}
      >
        {isPlacing ? '取消标注' : '添加标注'}
      </button>

      {visibleAnnotations.map(ann => (
        <MarkerPin
          key={ann.id}
          number={ann.markerNumber}
          active={selectedId === ann.id}
          onClick={() => onSelect(ann.id)}
          style={{
            left: `${ann.x * 100}%`,
            top: `${ann.y * 100}%`,
            pointerEvents: 'auto',
          }}
        />
      ))}
    </div>
  )
}
