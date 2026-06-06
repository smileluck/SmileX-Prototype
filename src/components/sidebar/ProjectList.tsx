import { Plus, Trash2, FileCode2 } from 'lucide-react'
import type { Prototype } from '../../types'

interface ProjectListProps {
  prototypes: Prototype[]
  activeId: string | null
  onSelect: (id: string) => void
  onCreate: () => void
  onDelete: (id: string) => void
}

export function ProjectList({ prototypes, activeId, onSelect, onCreate, onDelete }: ProjectListProps) {
  return (
    <div className="flex flex-col h-full bg-base-200">
      <div className="p-3 border-b border-base-300">
        <button className="btn btn-primary btn-sm w-full" onClick={onCreate}>
          <Plus className="h-4 w-4" /> 新建原型
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {prototypes.length === 0 && (
          <p className="text-center text-sm text-base-content/40 py-4">暂无项目</p>
        )}
        {prototypes.map(p => (
          <div
            key={p.id}
            onClick={() => onSelect(p.id)}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer text-sm group ${
              activeId === p.id
                ? 'bg-primary text-primary-content'
                : 'hover:bg-base-300'
            }`}
          >
            <FileCode2 className="h-4 w-4 shrink-0" />
            <span className="flex-1 truncate">{p.name}</span>
            <button
              className={`btn btn-xs btn-ghost opacity-0 group-hover:opacity-100 ${
                activeId === p.id ? 'text-primary-content' : 'text-error'
              }`}
              onClick={(e) => {
                e.stopPropagation()
                onDelete(p.id)
              }}
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
