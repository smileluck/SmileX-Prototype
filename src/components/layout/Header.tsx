import { useState, useRef, useEffect } from 'react'
import { PanelLeft, PanelLeftClose, GitBranch, Share2, FileText } from 'lucide-react'

interface HeaderProps {
  projectName?: string
  sidebarVisible?: boolean
  onToggleSidebar?: () => void
  onOpenFlowchart?: () => void
  onPublish?: () => void
  onOpenDocuments?: () => void
  hasPrototype?: boolean
  hasSrs?: boolean
  hasHandbook?: boolean
}

export function Header({ projectName, sidebarVisible, onToggleSidebar, onOpenFlowchart, onPublish, onOpenDocuments, hasPrototype, hasSrs, hasHandbook }: HeaderProps) {
  const [showPublishMenu, setShowPublishMenu] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!showPublishMenu) return
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowPublishMenu(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [showPublishMenu])

  return (
    <div className="navbar bg-base-100 border-b border-base-300 px-4 gap-2">
      <div className="flex-1 flex items-center gap-2">
        {onToggleSidebar && (
          <button className="btn btn-sm btn-ghost btn-square" onClick={onToggleSidebar}>
            {sidebarVisible ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeft className="h-4 w-4" />}
          </button>
        )}
        <span className="text-lg font-bold">SmileX Prototype</span>
        {projectName && (
          <span className="text-sm text-base-content/60 ml-2">/ {projectName}</span>
        )}
      </div>
      <div className="flex-none flex items-center gap-2">
        {onOpenDocuments && (hasSrs || hasHandbook) && (
          <button className="btn btn-sm btn-ghost" onClick={onOpenDocuments}>
            <FileText className="h-4 w-4" /> 文档
          </button>
        )}
        {onOpenFlowchart && (
          <button className="btn btn-sm btn-ghost" onClick={onOpenFlowchart}>
            <GitBranch className="h-4 w-4" /> 流程图
          </button>
        )}
        {hasPrototype && onPublish && (
          <div className="relative" ref={menuRef}>
            <button className="btn btn-sm btn-ghost" onClick={() => setShowPublishMenu(v => !v)}>
              <Share2 className="h-4 w-4" /> 发布
            </button>
            {showPublishMenu && (
              <div className="absolute right-0 top-full mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg py-1 z-50 min-w-[160px]">
                <button
                  className="btn btn-sm btn-ghost w-full justify-start rounded-none"
                  onClick={() => { setShowPublishMenu(false); onPublish() }}
                >
                  分享链接 / 导出 HTML
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
