import { useState, useCallback, useRef, useImperativeHandle, forwardRef, useEffect } from 'react'
import type { Prototype, PageInfo } from '../../types'
import { SandboxRenderer, type SandboxRendererHandle } from './SandboxRenderer'
import { AnnotationOverlay } from './AnnotationOverlay'

export interface PrototypeViewHandle {
  navigateToPage: (page: string) => void
}

interface PrototypeViewProps {
  prototype: Prototype
  selectedAnnotationId: string | null
  hasPending: boolean
  onSelectAnnotation: (id: string) => void
  onPlaceAnnotation: (selector: string, scope: 'global' | 'page', page?: string) => void
  onPagesChange?: (pages: PageInfo[]) => void
  onActivePageChange?: (page: string | null) => void
}

export const PrototypeView = forwardRef<PrototypeViewHandle, PrototypeViewProps>(
  function PrototypeView({
    prototype,
    selectedAnnotationId,
    hasPending,
    onSelectAnnotation,
    onPlaceAnnotation,
    onPagesChange,
    onActivePageChange: onActivePageChangeProp,
  }, ref) {
    const [loaded, setLoaded] = useState(false)
    const [activePage, setActivePage] = useState<string | null>(null)
    const [isPlacing, setIsPlacing] = useState(false)
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

    const handleAnnotationClick = useCallback((id: string) => {
      onSelectAnnotation(id)
    }, [onSelectAnnotation])

    const handleAnnotationPlaced = useCallback((selector: string, page: string | null, scope: 'global' | 'page') => {
      setIsPlacing(false)
      onPlaceAnnotation(selector, scope, page ?? undefined)
    }, [onPlaceAnnotation])

    const handleStartPlacing = useCallback(() => {
      setIsPlacing(true)
      sandboxRef.current?.startPlacing()
    }, [])

    const handleCancelPlacing = useCallback(() => {
      setIsPlacing(false)
      sandboxRef.current?.cancelPlacing()
    }, [])

    // Sync annotations to iframe whenever they change
    useEffect(() => {
      if (!loaded) return
      sandboxRef.current?.renderAnnotations(
        prototype.annotations,
        activePage,
        selectedAnnotationId,
      )
    }, [prototype.annotations, activePage, selectedAnnotationId, loaded])

    return (
      <div className="relative w-full h-full bg-base-300 rounded-lg overflow-hidden">
        <SandboxRenderer
          ref={sandboxRef}
          htmlCode={prototype.generatedCode}
          onPagesDiscovered={handlePagesDiscovered}
          onActivePageChange={handleActivePageChange}
          onAnnotationClick={handleAnnotationClick}
          onAnnotationPlaced={handleAnnotationPlaced}
        />
        {loaded && prototype.mode === 'prototype' && !hasPending && (
          <AnnotationOverlay
            isPlacing={isPlacing}
            onStartPlacing={handleStartPlacing}
            onCancelPlacing={handleCancelPlacing}
          />
        )}
      </div>
    )
  },
)
