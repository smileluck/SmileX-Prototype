import { useState } from 'react'
import type { Prototype } from '../../types'
import { SandboxRenderer } from './SandboxRenderer'
import { AnnotationOverlay } from './AnnotationOverlay'

interface PrototypeViewProps {
  prototype: Prototype
  onPlaceMarker: (x: number, y: number) => void
  selectedAnnotationId: string | null
  onSelectAnnotation: (id: string) => void
}

export function PrototypeView({
  prototype,
  onPlaceMarker,
  selectedAnnotationId,
  onSelectAnnotation,
}: PrototypeViewProps) {
  const [loaded, setLoaded] = useState(false)

  return (
    <div className="relative w-full h-full bg-base-300 rounded-lg overflow-hidden">
      <SandboxRenderer
        htmlCode={prototype.generatedCode}
        onContentReady={() => setLoaded(true)}
      />
      {loaded && prototype.mode === 'prototype' && (
        <AnnotationOverlay
          annotations={prototype.annotations}
          onPlaceMarker={onPlaceMarker}
          selectedId={selectedAnnotationId}
          onSelect={onSelectAnnotation}
        />
      )}
    </div>
  )
}
