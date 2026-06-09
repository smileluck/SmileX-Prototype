import { useState, useRef, useEffect } from 'react'
import { Download, ChevronDown, FileText } from 'lucide-react'

export type ExportFormat = 'md' | 'docx' | 'pdf'

interface FormatDropdownProps {
  onFormat: (format: ExportFormat) => void
  disabled?: boolean
}

const formats: { value: ExportFormat; label: string }[] = [
  { value: 'md', label: 'Markdown (.md)' },
  { value: 'docx', label: 'Word (.docx)' },
  { value: 'pdf', label: 'PDF (.pdf)' },
]

export function FormatDropdown({ onFormat, disabled }: FormatDropdownProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        className="btn btn-sm btn-ghost"
        onClick={() => setOpen(v => !v)}
        disabled={disabled}
        title="下载"
      >
        <Download className="h-4 w-4" />
        <ChevronDown className="h-3 w-3" />
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 bg-base-100 border border-base-300 rounded-lg shadow-lg py-1 z-50 min-w-[180px]">
          {formats.map(f => (
            <button
              key={f.value}
              className="btn btn-sm btn-ghost w-full justify-start rounded-none"
              onClick={() => { setOpen(false); onFormat(f.value) }}
            >
              <FileText className="h-4 w-4" /> {f.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
