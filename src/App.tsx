import { useState, useCallback } from 'react'
import { Header } from './components/layout/Header'
import { MainLayout } from './components/layout/MainLayout'
import { ProjectList } from './components/sidebar/ProjectList'
import { AnnotationSidebar } from './components/sidebar/AnnotationSidebar'
import { PrototypeView } from './components/prototype/PrototypeView'
import { EmptyState } from './components/shared/EmptyState'
import { usePrototype } from './hooks/usePrototype'
import { useAnnotations } from './hooks/useAnnotations'
import { exportToJSON, importFromJSON } from './services/storage'
import { downloadJSON, readFileAsText } from './utils/export'
import type { PageInfo } from './types'

export default function App() {
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [pages, setPages] = useState<PageInfo[]>([])
  const [activePage, setActivePage] = useState<string | null>(null)

  const {
    activePrototype,
    prototypes,
    selectPrototype,
    updatePrototype,
    createPrototype,
    removePrototype,
  } = usePrototype()

  const { annotations, addAnnotation, updateAnnotation, deleteAnnotation } = useAnnotations(
    activePrototype,
    updatePrototype,
  )

  const handleCreate = useCallback(async () => {
    const name = prompt('请输入原型名称', '未命名原型')
    if (name) await createPrototype(name)
  }, [createPrototype])

  const handleModeChange = useCallback((mode: 'prototype' | 'preview') => {
    updatePrototype(p => ({ ...p, mode, updatedAt: Date.now() }))
  }, [updatePrototype])

  const handleExport = useCallback(() => {
    if (!activePrototype) return
    const json = exportToJSON(activePrototype)
    downloadJSON(json, `${activePrototype.name}.smilex.json`)
  }, [activePrototype])

  const handleImport = useCallback(async () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) return
      try {
        const text = await readFileAsText(file)
        const p = await importFromJSON(text)
        await selectPrototype(p.id)
      } catch (err) {
        setErrorMsg(err instanceof Error ? err.message : '导入失败')
      }
    }
    input.click()
  }, [selectPrototype])

  const handlePlaceMarker = useCallback((x: number, y: number, page?: string) => {
    addAnnotation(x, y, page)
  }, [addAnnotation])

  const handleSelectAnnotation = useCallback((id: string) => {
    setSelectedAnnotationId(id)
  }, [])

  return (
    <div className="flex flex-col h-full bg-base-100">
      <Header
        mode={activePrototype?.mode ?? 'prototype'}
        onModeChange={handleModeChange}
        projectName={activePrototype?.name}
      />

      <MainLayout
        leftSidebar={
          <ProjectList
            prototypes={prototypes}
            activeId={activePrototype?.id ?? null}
            onSelect={selectPrototype}
            onCreate={handleCreate}
            onDelete={removePrototype}
          />
        }
        rightSidebar={
          <AnnotationSidebar
            annotations={annotations}
            pages={pages}
            activePage={activePage}
            selectedId={selectedAnnotationId}
            onUpdate={updateAnnotation}
            onDelete={deleteAnnotation}
            onSelect={handleSelectAnnotation}
          />
        }
        showRightSidebar={activePrototype?.mode === 'prototype' && !!activePrototype}
      >
        {errorMsg && (
          <div className="alert alert-error alert-sm mx-3 mt-2">
            <span className="text-sm">{errorMsg}</span>
            <button className="btn btn-xs btn-ghost" onClick={() => setErrorMsg(null)}>关闭</button>
          </div>
        )}

        <div className="flex-1 overflow-hidden relative">
          {!activePrototype ? (
            <EmptyState text="创建或选择一个原型项目开始" />
          ) : !activePrototype.generatedCode ? (
            <EmptyState text="导入 JSON 文件加载原型" />
          ) : (
            <PrototypeView
              prototype={activePrototype}
              onPlaceMarker={handlePlaceMarker}
              selectedAnnotationId={selectedAnnotationId}
              onSelectAnnotation={handleSelectAnnotation}
              onPagesChange={setPages}
              onActivePageChange={setActivePage}
            />
          )}
        </div>

        <div className="flex gap-2 p-2 border-t border-base-300">
          <button className="btn btn-sm btn-ghost" onClick={handleExport}>
            导出 JSON
          </button>
          <button className="btn btn-sm btn-ghost" onClick={handleImport}>
            导入 JSON
          </button>
        </div>
      </MainLayout>
    </div>
  )
}
