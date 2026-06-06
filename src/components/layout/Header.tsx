import { Eye, PenTool } from 'lucide-react'

interface HeaderProps {
  mode: 'prototype' | 'preview'
  onModeChange: (mode: 'prototype' | 'preview') => void
  projectName?: string
}

export function Header({ mode, onModeChange, projectName }: HeaderProps) {
  return (
    <div className="navbar bg-base-100 border-b border-base-300 px-4 gap-2">
      <div className="flex-1">
        <span className="text-lg font-bold">SmileX Prototype</span>
        {projectName && (
          <span className="text-sm text-base-content/60 ml-2">/ {projectName}</span>
        )}
      </div>
      <div className="flex-none">
        <div className="join">
          <button
            className={`btn btn-sm join-item ${mode === 'prototype' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => onModeChange('prototype')}
          >
            <PenTool className="h-4 w-4" /> 原型
          </button>
          <button
            className={`btn btn-sm join-item ${mode === 'preview' ? 'btn-primary' : 'btn-ghost'}`}
            onClick={() => onModeChange('preview')}
          >
            <Eye className="h-4 w-4" /> 预览
          </button>
        </div>
      </div>
    </div>
  )
}
