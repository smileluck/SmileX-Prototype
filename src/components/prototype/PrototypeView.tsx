import { useState, useCallback, useRef, useImperativeHandle, forwardRef } from 'react'
import type { Prototype, PageInfo } from '../../types'
import { SandboxRenderer, type SandboxRendererHandle } from './SandboxRenderer'
import { AnnotationOverlay } from './AnnotationOverlay'

export interface PrototypeViewHandle {
  navigateToPage: (page: string) => void
}

interface PrototypeViewProps {
  prototype: Prototype
  onPlaceMarker: (x: number, y: number, page?: string) => void
  selectedAnnotationId: string | null
  onSelectAnnotation: (id: string) => void
  onPagesChange?: (pages: PageInfo[]) => void
  onActivePageChange?: (page: string | null) => void
}

export const PrototypeView = forwardRef<PrototypeViewHandle, PrototypeViewProps>(
  function PrototypeView({
    prototype,
    onPlaceMarker,
    selectedAnnotationId,
    onSelectAnnotation,
    onPagesChange,
    onActivePageChange: onActivePageChangeProp,
  }, ref) {
    const [loaded, setLoaded] = useState(false)
    const [activePage, setActivePage] = useState<string | null>(null)
    const sandboxRef = useRef<SandboxRendererHandle>(null)

    useImperativeHandle(ref, () => ({
      navigateToPage(page: string) {
        sandboxRef.current?.navigateToPage(page)
      },
    }))

    const handlePagesDiscovered = useCallback((pages: PageInfo[]) => {
      setLoaded(true)
      onPagesChange?.(pages)
    }, [onPagesChange])

    const handleActivePageChange = useCallback((page: string | null) => {
      setActivePage(page)
      onActivePageChangeProp?.(page)
    }, [onActivePageChangeProp])

    const handlePlaceMarker = useCallback((x: number, y: number) => {
      onPlaceMarker(x, y, activePage ?? undefined)
    }, [onPlaceMarker, activePage])

    const handleSelectAnnotation = useCallback((id: string) => {
      onSelectAnnotation(id)
      const ann = prototype.annotations.find(a => a.id === id)
      if (ann?.page && ann.page !== activePage) {
        sandboxRef.current?.navigateToPage(ann.page)
      }
    }, [onSelectAnnotation, prototype.annotations, activePage])

    return (
      <div className="relative w-full h-full bg-base-300 rounded-lg overflow-hidden">
        <SandboxRenderer
          ref={sandboxRef}
          htmlCode={prototype.generatedCode}
          onPagesDiscovered={handlePagesDiscovered}
          onActivePageChange={handleActivePageChange}
        />
        {loaded && prototype.mode === 'prototype' && (
          <AnnotationOverlay
            annotations={prototype.annotations}
            activePage={activePage}
            onPlaceMarker={handlePlaceMarker}
            selectedId={selectedAnnotationId}
            onSelect={handleSelectAnnotation}
          />
        )}
      </div>
    )
  },
)
