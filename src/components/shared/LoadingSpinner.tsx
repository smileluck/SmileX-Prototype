import { Loader2 } from 'lucide-react'

export function LoadingSpinner({ text = '加载中...' }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 p-8 text-base-content/60">
      <Loader2 className="h-8 w-8 animate-spin" />
      <span>{text}</span>
    </div>
  )
}
