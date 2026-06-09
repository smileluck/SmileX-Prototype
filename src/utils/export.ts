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

export async function downloadPdf(element: HTMLElement, filename: string) {
  const html2pdf = (await import('html2pdf.js')).default
  const opt = {
    margin: [10, 15, 10, 15] as [number, number, number, number],
    filename,
    image: { type: 'jpeg' as const, quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true },
    jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const },
  }
  await html2pdf().set(opt).from(element).save()
}

export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsText(file)
  })
}
