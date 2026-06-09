import { markdownToDocxBlob } from './markdown-to-docx'

function triggerDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}

export function downloadJSON(content: string, filename: string) {
  const blob = new Blob([content], { type: 'application/json' })
  triggerDownload(blob, filename)
}

export function downloadMarkdown(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/markdown;charset=utf-8' })
  triggerDownload(blob, filename)
}

export async function downloadDocx(content: string, filename: string) {
  const blob = await markdownToDocxBlob(content)
  triggerDownload(blob, filename)
}

export async function downloadPdf(content: string, filename: string) {
  const { marked } = await import('marked')
  const html = await marked(content)

  const iframe = document.createElement('iframe')
  iframe.style.cssText = 'position:fixed;left:-9999px;width:210mm;'
  document.body.appendChild(iframe)

  const doc = iframe.contentDocument!
  doc.open()
  doc.write(`<!DOCTYPE html><html><head><meta charset="utf-8"><title>${filename}</title>
<style>
  @page { margin: 15mm; }
  body { font-family: "Microsoft YaHei", "PingFang SC", sans-serif; line-height: 1.8; color: #333; }
  h1 { font-size: 22px; margin: 24px 0 12px; }
  h2 { font-size: 18px; margin: 20px 0 10px; }
  h3 { font-size: 15px; margin: 16px 0 8px; }
  table { border-collapse: collapse; width: 100%; margin: 12px 0; }
  th, td { border: 1px solid #d0d0d0; padding: 6px 10px; text-align: left; }
  th { background: #f5f5f5; font-weight: bold; }
  code { background: #f5f5f5; padding: 2px 5px; border-radius: 3px; font-family: Consolas, monospace; font-size: 0.9em; }
  pre { background: #f5f5f5; padding: 12px; border-radius: 6px; overflow-x: auto; }
  pre code { background: none; padding: 0; }
  blockquote { border-left: 4px solid #d0d0d0; margin: 12px 0; padding: 4px 16px; color: #666; }
  hr { border: none; border-top: 1px solid #d0d0d0; margin: 16px 0; }
  img { max-width: 100%; }
  ul, ol { padding-left: 24px; }
</style></head><body>${html}</body></html>`)
  doc.close()

  await new Promise<void>(resolve => setTimeout(resolve, 200))
  iframe.contentWindow!.print()
  document.body.removeChild(iframe)
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsText(file)
  })
}
