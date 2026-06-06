import { FileQuestion } from 'lucide-react'

export function EmptyState({ text = '暂无内容' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 p-8 text-base-content/40">
      <FileQuestion className="h-12 w-12" />
      <span className="text-sm">{text}</span>
    </div>
  )
}
