import { useState, useCallback, useRef } from 'react'
import { Header } from './components/layout/Header'
import { MainLayout } from './components/layout/MainLayout'
import { ProjectList } from './components/sidebar/ProjectList'
import { AnnotationSidebar } from './components/sidebar/AnnotationSidebar'
import { PrototypeView, type PrototypeViewHandle } from './components/prototype/PrototypeView'
import { EmptyState } from './components/shared/EmptyState'
import { FlowchartModal } from './components/flowchart/FlowchartModal'
import { usePrototype } from './hooks/usePrototype'
import { useAnnotations } from './hooks/useAnnotations'
import { savePrototype } from './services/storage'
import type { PageInfo } from './types'

export default function App() {
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null)
  const [pendingAnnotationId, setPendingAnnotationId] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [pages, setPages] = useState<PageInfo[]>([])
  const [activePage, setActivePage] = useState<string | null>(null)
  const [leftSidebarVisible, setLeftSidebarVisible] = useState(true)
  const [showFlowchart, setShowFlowchart] = useState(false)
  const prototypeViewRef = useRef<PrototypeViewHandle>(null)

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

  const handlePlaceAnnotation = useCallback((selector: string, scope: 'global' | 'page', page?: string) => {
    const id = addAnnotation(selector, scope, page)
    if (id) {
      setSelectedAnnotationId(id)
      setPendingAnnotationId(id)
    }
  }, [addAnnotation])

  const prototypeRef = useRef(activePrototype)
  prototypeRef.current = activePrototype

  const handleConfirmAnnotation = useCallback(async () => {
    setPendingAnnotationId(null)
    if (prototypeRef.current) {
      await savePrototype(prototypeRef.current)
    }
  }, [])

  const handleSelectAnnotation = useCallback((id: string) => {
    setSelectedAnnotationId(id)
  }, [])

  const handleNavigate = useCallback((page: string) => {
    prototypeViewRef.current?.navigateToPage(page)
  }, [])

  return (
    <div className="flex flex-col h-full bg-base-100">
      <Header
        mode={activePrototype?.mode ?? 'prototype'}
        onModeChange={handleModeChange}
        projectName={activePrototype?.name}
        sidebarVisible={leftSidebarVisible}
        onToggleSidebar={() => setLeftSidebarVisible(v => !v)}
        onOpenFlowchart={activePrototype ? () => setShowFlowchart(true) : undefined}
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
            pendingId={pendingAnnotationId}
            onUpdate={updateAnnotation}
            onDelete={deleteAnnotation}
            onSelect={handleSelectAnnotation}
            onConfirm={handleConfirmAnnotation}
            onNavigate={handleNavigate}
          />
        }
        showLeftSidebar={leftSidebarVisible}
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
              ref={prototypeViewRef}
              prototype={activePrototype}
              onPlaceAnnotation={handlePlaceAnnotation}
              selectedAnnotationId={selectedAnnotationId}
              onSelectAnnotation={handleSelectAnnotation}
              onPagesChange={setPages}
              onActivePageChange={setActivePage}
            />
          )}
        </div>

      </MainLayout>

      {showFlowchart && activePrototype && (
        <FlowchartModal
          slug={activePrototype.id}
          onClose={() => setShowFlowchart(false)}
        />
      )}
    </div>
  )
}
