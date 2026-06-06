import { useState, useCallback, useEffect } from 'react'
import type { Prototype } from '../types'
import { savePrototype, loadPrototype, listPrototypes, deletePrototype as deleteProto } from '../services/storage'

export function usePrototype() {
  const [activePrototype, setActivePrototype] = useState<Prototype | null>(null)
  const [prototypes, setPrototypes] = useState<Prototype[]>([])

  const refreshList = useCallback(async () => {
    const list = await listPrototypes()
    setPrototypes(list)
    return list
  }, [])

  const selectPrototype = useCallback(async (id: string) => {
    const p = await loadPrototype(id)
    if (p) setActivePrototype(p)
  }, [])

  useEffect(() => {
    refreshList().then(list => {
      if (list.length > 0) selectPrototype(list[0].id)
    })
  }, [])

  const updatePrototype = useCallback(async (updater: (p: Prototype) => Prototype) => {
    setActivePrototype(prev => {
      if (!prev) return prev
      const updated = updater(prev)
      savePrototype(updated)
      return updated
    })
  }, [])

  const createPrototype = useCallback(async (name: string) => {
    const now = Date.now()
    const slug = name
      .toLowerCase()
      .replace(/[^\w一-鿿]+/g, '-')
      .replace(/^-+|-+$/g, '')
      || `project-${Date.now()}`
    const p: Prototype = {
      id: slug,
      name,
      prompt: '',
      generatedCode: '',
      annotations: [],
      mode: 'prototype',
      createdAt: now,
      updatedAt: now,
    }
    await savePrototype(p)
    setActivePrototype(p)
    await refreshList()
    return p
  }, [refreshList])

  const removePrototype = useCallback(async (id: string) => {
    await deleteProto(id)
    if (activePrototype?.id === id) setActivePrototype(null)
    await refreshList()
  }, [activePrototype, refreshList])

  return {
    activePrototype,
    prototypes,
    selectPrototype,
    updatePrototype,
    createPrototype,
    removePrototype,
    setActivePrototype,
    refreshList,
  }
}
