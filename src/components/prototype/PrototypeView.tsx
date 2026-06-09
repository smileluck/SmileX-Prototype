import { useState, useCallback, useRef, useImperativeHandle, forwardRef, useEffect } from 'react'
import type { Prototype, PageInfo, Annotation } from '../../types'
import type { HistoryEntry } from '../../hooks/useUndoHistory'
import { SandboxRenderer, type SandboxRendererHandle } from './SandboxRenderer'
import { OperationToolbar } from './OperationToolbar'

export interface PrototypeViewHandle {
  navigateToPage: (page: string) => void
  focusAnnotation: (id: string) => void
}

interface PrototypeViewProps {
  prototype: Prototype
  selectedAnnotationId: string | null
  hasPending: boolean
  onSelectAnnotation: (id: string) => void
  onPlaceAnnotation: (selector: string, scope: 'global' | 'page', page?: string) => void
  onPagesChange?: (pages: PageInfo[]) => void
  onActivePageChange?: (page: string | null) => void
  publishMode?: boolean
  canUndo?: boolean
  canRedo?: boolean
  undoHistory?: HistoryEntry<Annotation[]>[]
  onUndo?: () => void
  onRedo?: () => void
  onJumpTo?: (index: number) => void
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
    publishMode,
    canUndo,
    canRedo,
    undoHistory,
    onUndo,
    onRedo,
    onJumpTo,
  }, ref) {
    const [loaded, setLoaded] = useState(false)
    const [activePage, setActivePage] = useState<string | null>(null)
    const [isPlacing, setIsPlacing] = useState(false)
    const sandboxRef = useRef<SandboxRendererHandle>(null)

    useEffect(() => {
      setLoaded(false)
    }, [prototype.id])

    useImperativeHandle(ref, () => ({
      navigateToPage(page: string) {
        sandboxRef.current?.navigateToPage(page)
      },
      focusAnnotation(id: string) {
        sandboxRef.current?.focusAnnotation(id)
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
        {loaded && !hasPending && !publishMode && (
          <OperationToolbar
            canUndo={canUndo ?? false}
            canRedo={canRedo ?? false}
            history={undoHistory ?? []}
            onUndo={onUndo ?? (() => {})}
            onRedo={onRedo ?? (() => {})}
            onJumpTo={onJumpTo ?? (() => {})}
            onAddAnnotation={handleStartPlacing}
            onCancelPlacing={handleCancelPlacing}
            isPlacing={isPlacing}
          />
        )}
      </div>
    )
  },
)
