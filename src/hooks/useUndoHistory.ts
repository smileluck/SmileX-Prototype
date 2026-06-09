import { useState, useCallback, useRef } from 'react'

export interface HistoryEntry<T> {
  snapshot: T
  label: string
  timestamp: number
}

export function useUndoHistory<T>(maxSteps = 50) {
  const pastRef = useRef<HistoryEntry<T>[]>([])
  const futureRef = useRef<HistoryEntry<T>[]>([])
  const [, setVersion] = useState(0)
  const bump = useCallback(() => setVersion(v => v + 1), [])

  const push = useCallback((snapshot: T, label: string) => {
    if (pastRef.current.length >= maxSteps) {
      pastRef.current = pastRef.current.slice(1)
    }
    pastRef.current = [...pastRef.current, { snapshot, label, timestamp: Date.now() }]
    futureRef.current = []
    bump()
  }, [maxSteps, bump])

  const undo = useCallback((currentSnapshot: T): HistoryEntry<T> | null => {
    if (pastRef.current.length === 0) return null
    const newPast = [...pastRef.current]
    const entry = newPast.pop()!
    pastRef.current = newPast
    futureRef.current = [
      { snapshot: currentSnapshot, label: entry.label, timestamp: Date.now() },
      ...futureRef.current,
    ]
    bump()
    return entry
  }, [bump])

  const redo = useCallback((currentSnapshot: T): HistoryEntry<T> | null => {
    if (futureRef.current.length === 0) return null
    const entry = futureRef.current[0]
    futureRef.current = futureRef.current.slice(1)
    pastRef.current = [
      ...pastRef.current,
      { snapshot: currentSnapshot, label: entry.label, timestamp: Date.now() },
    ]
    bump()
    return entry
  }, [bump])

  const jumpTo = useCallback((currentSnapshot: T, index: number): HistoryEntry<T> | null => {
    const pastLen = pastRef.current.length
    if (index < 0 || index >= pastLen) return null
    const entry = pastRef.current[index]
    const moved = pastRef.current.slice(index + 1).reverse()
    futureRef.current = [
      { snapshot: currentSnapshot, label: entry.label, timestamp: Date.now() },
      ...moved,
    ]
    pastRef.current = pastRef.current.slice(0, index)
    bump()
    return entry
  }, [bump])

  const clear = useCallback(() => {
    pastRef.current = []
    futureRef.current = []
    bump()
  }, [bump])

  return {
    push,
    undo,
    redo,
    jumpTo,
    clear,
    canUndo: pastRef.current.length > 0,
    canRedo: futureRef.current.length > 0,
    history: pastRef.current,
  }
}
