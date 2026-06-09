import { useState, useEffect, useCallback } from 'react'
import { X, Copy, FileText, BookOpen } from 'lucide-react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { loadSrs, loadHandbook } from '../../services/storage'
import { downloadMarkdown, downloadDocx, downloadPdf } from '../../utils/export'
import { FormatDropdown } from './FormatDropdown'
import type { ExportFormat } from './FormatDropdown'

interface DocumentsModalProps {
  slug: string
  hasSrs: boolean
  hasHandbook: boolean
  onClose: () => void
}

type DocTab = 'srs' | 'handbook'

export function DocumentsModal({ slug, hasSrs, hasHandbook, onClose }: DocumentsModalProps) {
  const [tab, setTab] = useState<DocTab>(hasSrs ? 'srs' : 'handbook')
  const [srsContent, setSrsContent] = useState<string | null>(null)
  const [handbookContent, setHandbookContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const [exporting, setExporting] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)

    const load = tab === 'srs' ? loadSrs : loadHandbook
    const setContent = tab === 'srs' ? setSrsContent : setHandbookContent

    load(slug).then(content => {
      if (!cancelled) {
        setContent(content)
        setLoading(false)
      }
    })

    return () => { cancelled = true }
  }, [slug, tab])

  const currentContent = tab === 'srs' ? srsContent : handbookContent

  const handleExport = useCallback(async (format: ExportFormat) => {
    if (!currentContent) return
    const baseName = tab === 'srs' ? 'srs' : 'handbook'
    setExporting(true)
    try {
      switch (format) {
        case 'md':
          downloadMarkdown(currentContent, `${baseName}.md`)
          break
        case 'docx':
          await downloadDocx(currentContent, `${baseName}.docx`)
          break
        case 'pdf':
          await downloadPdf(currentContent, `${baseName}.pdf`)
          break
      }
    } finally {
      setExporting(false)
    }
  }, [currentContent, tab])

  const handleCopy = useCallback(() => {
    if (!currentContent) return
    navigator.clipboard.writeText(currentContent).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }, [currentContent])

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-4xl w-full h-[85vh] flex flex-col p-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-base-300">
          <div className="flex items-center gap-1">
            {/* Tab buttons */}
            {hasSrs && (
              <button
                className={`btn btn-sm ${tab === 'srs' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => { setTab('srs'); setLoading(true) }}
              >
                <FileText className="h-4 w-4" /> 需求规格说明书
              </button>
            )}
            {hasHandbook && (
              <button
                className={`btn btn-sm ${tab === 'handbook' ? 'btn-primary' : 'btn-ghost'}`}
                onClick={() => { setTab('handbook'); setLoading(true) }}
              >
                <BookOpen className="h-4 w-4" /> 用户手册
              </button>
            )}
          </div>
          <div className="flex items-center gap-1">
            <FormatDropdown
              onFormat={handleExport}
              disabled={!currentContent || exporting}
            />
            <button
              className="btn btn-sm btn-ghost"
              onClick={handleCopy}
              disabled={!currentContent}
              title="复制"
            >
              <Copy className="h-4 w-4" /> {copied ? '已复制' : ''}
            </button>
            <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}>
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto p-6 min-h-0">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <span className="loading loading-spinner loading-lg" />
            </div>
          ) : !currentContent ? (
            <div className="flex items-center justify-center h-full text-base-content/50">
              <div className="text-center">
                <p className="text-lg">
                  {tab === 'srs' ? '暂无需求规格说明书' : '暂无用户手册'}
                </p>
                <p className="text-sm mt-1">
                  使用 /prototype-review {slug} --{tab} 生成
                </p>
              </div>
            </div>
          ) : (
            <div className="prose prose-sm max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {currentContent}
              </ReactMarkdown>
            </div>
          )}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button onClick={onClose}>close</button>
      </form>
    </dialog>
  )
}
