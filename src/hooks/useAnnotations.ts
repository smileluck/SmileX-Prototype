import { useCallback } from 'react'
import type { Annotation, Prototype } from '../types'
import { nanoid } from '../utils/id'

export function useAnnotations(
  prototype: Prototype | null,
  onUpdate: (updater: (p: Prototype) => Prototype) => void,
) {
  const addAnnotation = useCallback((selector: string, page?: string) => {
    if (!prototype) return
    const maxNum = prototype.annotations.reduce((max, a) => Math.max(max, a.markerNumber), 0)
    const now = Date.now()
    const annotation: Annotation = {
      id: nanoid(),
      markerNumber: maxNum + 1,
      selector,
      description: '',
      page,
      createdAt: now,
      updatedAt: now,
    }
    onUpdate(p => ({
      ...p,
      annotations: [...p.annotations, annotation],
      updatedAt: Date.now(),
    }))
  }, [prototype, onUpdate])

  const updateAnnotation = useCallback((id: string, description: string) => {
    onUpdate(p => ({
      ...p,
      annotations: p.annotations.map(a =>
        a.id === id ? { ...a, description, updatedAt: Date.now() } : a
      ),
      updatedAt: Date.now(),
    }))
  }, [onUpdate])

  const deleteAnnotation = useCallback((id: string) => {
    onUpdate(p => ({
      ...p,
      annotations: p.annotations.filter(a => a.id !== id),
      updatedAt: Date.now(),
    }))
  }, [onUpdate])

  return {
    annotations: prototype?.annotations ?? [],
    addAnnotation,
    updateAnnotation,
    deleteAnnotation,
  }
}
