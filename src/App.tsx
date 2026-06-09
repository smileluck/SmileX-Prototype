import { useState, useCallback, useRef, useEffect, useMemo } from 'react'
import { Header } from './components/layout/Header'
import { MainLayout } from './components/layout/MainLayout'
import { ProjectList } from './components/sidebar/ProjectList'
import { AnnotationSidebar } from './components/sidebar/AnnotationSidebar'
import { PrototypeView, type PrototypeViewHandle } from './components/prototype/PrototypeView'
import { EmptyState } from './components/shared/EmptyState'
import { FlowchartModal } from './components/flowchart/FlowchartModal'
import { DocumentsModal } from './components/documents/DocumentsModal'
import { PublishedView } from './components/published/PublishedView'
import { usePrototype } from './hooks/usePrototype'
import { useAnnotations } from './hooks/useAnnotations'
import { useUndoHistory } from './hooks/useUndoHistory'
import { savePrototype } from './services/storage'
import { downloadPublishedHTML } from './utils/publish'
import type { PageInfo } from './types'

function getViewSlug(): string | null {
  const params = new URLSearchParams(window.location.search)
  return params.get('view')
}

export default function App() {
  const viewSlug = useMemo(() => getViewSlug(), [])
  const [mode, setMode] = useState<'view' | 'edit'>(viewSlug ? 'view' : 'edit')
  const [selectedAnnotationId, setSelectedAnnotationId] = useState<string | null>(null)
  const [pendingAnnotationId, setPendingAnnotationId] = useState<string | null>(null)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [pages, setPages] = useState<PageInfo[]>([])
  const [activePage, setActivePage] = useState<string | null>(null)
  const [leftSidebarVisible, setLeftSidebarVisible] = useState(true)
  const [showFlowchart, setShowFlowchart] = useState(false)
  const [showDocuments, setShowDocuments] = useState(false)
  const [showPublishModal, setShowPublishModal] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const [copied, setCopied] = useState(false)
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

  const annotationHistory = useUndoHistory<import('./types').Annotation[]>(50)

  // Clear history when switching prototypes
  useEffect(() => {
    annotationHistory.clear()
  }, [activePrototype?.id])

  // Published view: render PublishedView directly
  const handleOpenInEditor = useCallback(() => {
    setMode('edit')
    const url = new URL(window.location.href)
    url.searchParams.delete('view')
    url.searchParams.set('edit', '1')
    window.history.replaceState({}, '', url.toString())
  }, [])

  // Publish modal: copy link + export HTML
  const handlePublish = useCallback(() => {
    setShowPublishModal(true)
  }, [])

  const shareUrl = useMemo(() => {
    if (!activePrototype) return ''
    const url = new URL(window.location.href)
    url.searchParams.delete('edit')
    url.searchParams.set('view', activePrototype.id)
    return url.toString()
  }, [activePrototype])

  const handleCopyLink = useCallback(() => {
    navigator.clipboard.writeText(shareUrl).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [shareUrl])

  const handleExportHTML = useCallback(() => {
    if (activePrototype) downloadPublishedHTML(activePrototype)
  }, [activePrototype])

  const handleCreate = useCallback(() => {
    setShowGuide(true)
  }, [])

  const handleGuideCreate = useCallback(async () => {
    setShowGuide(false)
    const name = prompt('请输入原型名称', '未命名原型')
    if (name) await createPrototype(name)
  }, [createPrototype])

  const handlePlaceAnnotation = useCallback((selector: string, scope: 'global' | 'page', page?: string) => {
    if (activePrototype) {
      annotationHistory.push(activePrototype.annotations, '添加标注')
    }
    const id = addAnnotation(selector, scope, page)
    if (id) {
      setSelectedAnnotationId(id)
      setPendingAnnotationId(id)
    }
  }, [addAnnotation, activePrototype, annotationHistory.push])

  const prototypeRef = useRef(activePrototype)
  prototypeRef.current = activePrototype

  const handleConfirmAnnotation = useCallback(async () => {
    if (!prototypeRef.current) return
    const pending = prototypeRef.current.annotations.find(a => a.id === pendingAnnotationId)
    if (!pending?.description.trim()) return
    setPendingAnnotationId(null)
    await savePrototype(prototypeRef.current)
  }, [pendingAnnotationId])

  const handleDeleteAnnotation = useCallback(async (id: string) => {
    if (activePrototype) {
      const ann = activePrototype.annotations.find(a => a.id === id)
      const label = ann ? `删除标注 #${ann.markerNumber}` : '删除标注'
      annotationHistory.push(activePrototype.annotations, label)
    }
    if (id === pendingAnnotationId) {
      setPendingAnnotationId(null)
    }
    deleteAnnotation(id)
    if (prototypeRef.current) {
      const updated = {
        ...prototypeRef.current,
        annotations: prototypeRef.current.annotations.filter(a => a.id !== id),
        updatedAt: Date.now(),
      }
      await savePrototype(updated)
    }
  }, [deleteAnnotation, pendingAnnotationId, activePrototype, annotationHistory.push])

  const handleSelectAnnotation = useCallback((id: string) => {
    setSelectedAnnotationId(id)
    const ann = prototypeRef.current?.annotations.find(a => a.id === id)
    if (ann && ann.scope === 'page' && ann.page) {
      prototypeViewRef.current?.navigateToPage(ann.page)
    }
    prototypeViewRef.current?.focusAnnotation(id)
  }, [])

  const handleUndo = useCallback(() => {
    if (!activePrototype) return
    const entry = annotationHistory.undo(activePrototype.annotations)
    if (!entry) return
    const restored = entry.snapshot
    updatePrototype(p => ({ ...p, annotations: restored, updatedAt: Date.now() }))
    if (pendingAnnotationId && !restored.some(a => a.id === pendingAnnotationId)) {
      setPendingAnnotationId(null)
      setSelectedAnnotationId(null)
    }
  }, [activePrototype, annotationHistory, updatePrototype, pendingAnnotationId])

  const handleRedo = useCallback(() => {
    if (!activePrototype) return
    const entry = annotationHistory.redo(activePrototype.annotations)
    if (!entry) return
    const restored = entry.snapshot
    updatePrototype(p => ({ ...p, annotations: restored, updatedAt: Date.now() }))
    if (pendingAnnotationId && !restored.some(a => a.id === pendingAnnotationId)) {
      setPendingAnnotationId(null)
      setSelectedAnnotationId(null)
    }
  }, [activePrototype, annotationHistory, updatePrototype, pendingAnnotationId])

  const handleJumpTo = useCallback((index: number) => {
    if (!activePrototype) return
    const entry = annotationHistory.jumpTo(activePrototype.annotations, index)
    if (!entry) return
    const restored = entry.snapshot
    updatePrototype(p => ({ ...p, annotations: restored, updatedAt: Date.now() }))
    if (pendingAnnotationId && !restored.some(a => a.id === pendingAnnotationId)) {
      setPendingAnnotationId(null)
      setSelectedAnnotationId(null)
    }
  }, [activePrototype, annotationHistory, updatePrototype, pendingAnnotationId])

  // Keyboard shortcuts for undo/redo
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault()
        handleUndo()
      }
      if ((e.ctrlKey || e.metaKey) && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault()
        handleRedo()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [handleUndo, handleRedo])

  const handleNavigate = useCallback((page: string) => {
    prototypeViewRef.current?.navigateToPage(page)
  }, [])

  // Published view mode
  if (mode === 'view' && viewSlug) {
    return <PublishedView slug={viewSlug} onOpenInEditor={handleOpenInEditor} />
  }

  // Edit mode
  return (
    <div className="flex flex-col h-full bg-base-100">
      <Header
        projectName={activePrototype?.name}
        sidebarVisible={leftSidebarVisible}
        onToggleSidebar={() => setLeftSidebarVisible(v => !v)}
        onOpenFlowchart={activePrototype ? () => setShowFlowchart(true) : undefined}
        onPublish={activePrototype?.generatedCode ? handlePublish : undefined}
        onOpenDocuments={activePrototype ? () => setShowDocuments(true) : undefined}
        hasPrototype={!!activePrototype?.generatedCode}
        hasSrs={activePrototype?.hasSrs}
        hasHandbook={activePrototype?.hasHandbook}
      />

      <MainLayout
        leftSidebar={
          <ProjectList
            prototypes={prototypes}
            activeId={activePrototype?.id ?? null}
            onSelect={selectPrototype}
            onCreate={handleCreate}
            onDelete={(id: string) => {
                const p = prototypes.find(x => x.id === id)
                if (p && confirm(`确定删除「${p.name}」？此操作不可撤销。`)) removePrototype(id)
              }}
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
            onDelete={handleDeleteAnnotation}
            onSelect={handleSelectAnnotation}
            onConfirm={handleConfirmAnnotation}
            onNavigate={handleNavigate}
          />
        }
        showLeftSidebar={leftSidebarVisible}
        showRightSidebar={!!activePrototype}
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
              hasPending={!!pendingAnnotationId}
              onSelectAnnotation={handleSelectAnnotation}
              onPagesChange={setPages}
              onActivePageChange={setActivePage}
              canUndo={annotationHistory.canUndo}
              canRedo={annotationHistory.canRedo}
              undoHistory={annotationHistory.history}
              onUndo={handleUndo}
              onRedo={handleRedo}
              onJumpTo={handleJumpTo}
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

      {showDocuments && activePrototype && (
        <DocumentsModal
          slug={activePrototype.id}
          hasSrs={!!activePrototype.hasSrs}
          hasHandbook={!!activePrototype.hasHandbook}
          onClose={() => setShowDocuments(false)}
        />
      )}

      {/* Publish modal */}
      {showPublishModal && (
        <dialog className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg mb-4">发布原型</h3>
            <div className="form-control mb-4">
              <label className="label"><span className="label-text text-sm">分享链接</span></label>
              <div className="flex gap-2">
                <input type="text" className="input input-sm input-bordered flex-1 text-xs" value={shareUrl} readOnly />
                <button className="btn btn-sm btn-primary" onClick={handleCopyLink}>
                  {copied ? '已复制' : '复制'}
                </button>
              </div>
              <label className="label"><span className="label-text-alt text-xs text-base-content/50">别人打开此链接可查看只读标注预览</span></label>
            </div>
            <div className="divider text-xs text-base-content/40">或</div>
            <button className="btn btn-sm btn-outline w-full" onClick={handleExportHTML}>
              导出为独立 HTML 文件
            </button>
            <div className="modal-action">
              <button className="btn btn-sm" onClick={() => setShowPublishModal(false)}>关闭</button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop"><button onClick={() => setShowPublishModal(false)}>close</button></form>
        </dialog>
      )}

      {/* Guide modal */}
      {showGuide && (
        <dialog className="modal modal-open">
          <div className="modal-box max-w-lg">
            <h3 className="font-bold text-lg mb-4">新建原型使用流程</h3>
            <ol className="list-decimal list-inside space-y-3 text-sm leading-relaxed">
              <li>
                在项目根目录下启动 <kbd className="kbd kbd-sm">Claude Code</kbd>
                <pre className="bg-base-200 rounded px-3 py-1.5 mt-1 text-xs overflow-x-auto">cd /path/to/SmileX-Prototype
claude</pre>
              </li>
              <li>
                将原型 HTML 文件或需求文档放到 <code className="bg-base-200 px-1 rounded">website/</code> 目录下的自定义项目文件夹中
                <pre className="bg-base-200 rounded px-3 py-1.5 mt-1 text-xs overflow-x-auto">website/
  my-project/
    index.html      {'/* 原型 HTML */'}
    requirements.md  {'/* 需求文档 */'}</pre>
              </li>
              <li>
                在 Claude Code 中使用 <code className="bg-base-200 px-1 rounded">/prototype-review</code> 指令生成原型
                <pre className="bg-base-200 rounded px-3 py-1.5 mt-1 text-xs overflow-x-auto">{'/prototype-review website/my-project/requirements.md'}</pre>
                <p className="text-base-content/50 mt-1">也可以直接从 HTML 创建：查看、审查、标注已有原型</p>
              </li>
            </ol>
            <div className="modal-action">
              <button className="btn btn-sm btn-ghost" onClick={() => setShowGuide(false)}>知道了</button>
              <button className="btn btn-sm btn-primary" onClick={handleGuideCreate}>继续创建</button>
            </div>
          </div>
          <form method="dialog" className="modal-backdrop"><button onClick={() => setShowGuide(false)}>close</button></form>
        </dialog>
      )}
    </div>
  )
}
