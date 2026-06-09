import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, HeadingLevel, WidthType, BorderStyle, ShadingType } from 'docx'
import { lexer } from 'marked'
import type { Token, Tokens } from 'marked'

const FONT = 'Microsoft YaHei'

function textRuns(tokens: Token[]): TextRun[] {
  const runs: TextRun[] = []
  for (const t of tokens) {
    switch (t.type) {
      case 'text':
        runs.push(new TextRun({ text: t.text, font: FONT }))
        break
      case 'strong':
        runs.push(new TextRun({ text: (t as Tokens.Strong).text, bold: true, font: FONT }))
        break
      case 'em':
        runs.push(new TextRun({ text: (t as Tokens.Em).text, italics: true, font: FONT }))
        break
      case 'codespan':
        runs.push(new TextRun({ text: (t as Tokens.Codespan).text, font: 'Consolas', shading: { type: ShadingType.CLEAR, fill: 'f0f0f0' } }))
        break
      case 'link':
        runs.push(...textRuns((t as Tokens.Link).tokens ?? [{ type: 'text', text: t.text } as Token]))
        break
      case 'br':
        runs.push(new TextRun({ text: '', break: 1 }))
        break
      default:
        runs.push(new TextRun({ text: t.raw?.trim() ?? '', font: FONT }))
    }
  }
  return runs
}

function headingToParagraph(token: Tokens.Heading): Paragraph {
  const levels = [HeadingLevel.HEADING_1, HeadingLevel.HEADING_2, HeadingLevel.HEADING_3, HeadingLevel.HEADING_4, HeadingLevel.HEADING_5, HeadingLevel.HEADING_6]
  return new Paragraph({
    heading: levels[token.depth - 1],
    children: textRuns(token.tokens ?? []),
    spacing: { before: 240, after: 120 },
  })
}

function paragraphToParagraph(token: Tokens.Paragraph): Paragraph {
  return new Paragraph({
    children: textRuns(token.tokens ?? []),
    spacing: { after: 120 },
  })
}

function listToParagraphs(token: Tokens.List): Paragraph[] {
  const paragraphs: Paragraph[] = []
  for (let i = 0; i < token.items.length; i++) {
    const item = token.items[i]
    const prefix = token.ordered ? `${Number(token.start ?? 1) + i}. ` : '• '
    const indent = ((item as { depth?: number }).depth ?? 0) * 360
    const inlineTokens = item.tokens.filter(t => t.type !== 'list')
    const nestedLists = item.tokens.filter(t => t.type === 'list') as Tokens.List[]

    paragraphs.push(new Paragraph({
      children: [new TextRun({ text: prefix, font: FONT }), ...textRuns(inlineTokens)],
      indent: { left: indent },
      spacing: { after: 60 },
    }))

    for (const nested of nestedLists) {
      paragraphs.push(...listToParagraphs(nested))
    }
  }
  return paragraphs
}

function tableToTable(token: Tokens.Table): Table {
  const cellBorder = { style: BorderStyle.SINGLE, size: 1, color: 'cccccc' }
  const borders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder }
  const colCount = token.header.length
  const colWidth = Math.floor(9000 / colCount)

  const headerRow = new TableRow({
    tableHeader: true,
    children: token.header.map(cell =>
      new TableCell({
        children: [new Paragraph({ children: [new TextRun({ text: textRuns(cell.tokens ?? []).map(r => (r as unknown as { text: string }).text ?? '').join(''), bold: true, font: FONT })] })],
        borders,
        width: { size: colWidth, type: WidthType.DXA },
        shading: { type: ShadingType.CLEAR, fill: 'f5f5f5' },
      })
    ),
  })

  const rows = token.rows.map(row =>
    new TableRow({
      children: row.map(cell => {
        const cellRuns = textRuns(cell.tokens ?? [])
        const text = cellRuns.map(r => (r as unknown as { text: string }).text ?? '').join('')
        return new TableCell({
          children: [new Paragraph({ children: [new TextRun({ text, font: FONT })] })],
          borders,
          width: { size: colWidth, type: WidthType.DXA },
        })
      }),
    })
  )

  return new Table({ rows: [headerRow, ...rows], width: { size: 9000, type: WidthType.DXA } })
}

function codeBlockToParagraphs(token: Tokens.Code): Paragraph[] {
  const lines = token.text.split('\n')
  return lines.map(line =>
    new Paragraph({
      children: [new TextRun({ text: line || ' ', font: 'Consolas', size: 18 })],
      shading: { type: ShadingType.CLEAR, fill: 'f5f5f5' },
      spacing: { after: 0 },
    })
  )
}

function blockquoteToParagraphs(token: Tokens.Blockquote): Paragraph[] {
  return (token.tokens ?? []).map(t => {
    if (t.type === 'paragraph') {
      return new Paragraph({
        children: [new TextRun({ text: (t as Tokens.Paragraph).text, italics: true, font: FONT, color: '666666' })],
        indent: { left: 480 },
        border: { left: { style: BorderStyle.SINGLE, size: 6, color: 'cccccc', space: 10 } },
        spacing: { after: 60 },
      })
    }
    return new Paragraph({ children: [new TextRun({ text: t.raw, font: FONT })] })
  })
}

export async function markdownToDocxBlob(md: string): Promise<Blob> {
  const tokens = lexer(md)
  const children: (Paragraph | Table)[] = []

  for (const token of tokens) {
    switch (token.type) {
      case 'heading':
        children.push(headingToParagraph(token as Tokens.Heading))
        break
      case 'paragraph':
        children.push(paragraphToParagraph(token as Tokens.Paragraph))
        break
      case 'list':
        children.push(...listToParagraphs(token as Tokens.List))
        break
      case 'table':
        children.push(tableToTable(token as Tokens.Table))
        break
      case 'code':
        children.push(...codeBlockToParagraphs(token as Tokens.Code))
        break
      case 'blockquote':
        children.push(...blockquoteToParagraphs(token as Tokens.Blockquote))
        break
      case 'hr':
        children.push(new Paragraph({
          children: [],
          border: { bottom: { style: BorderStyle.SINGLE, size: 1, color: 'cccccc' } },
          spacing: { before: 120, after: 120 },
        }))
        break
      case 'space':
        break
      default:
        children.push(new Paragraph({ children: [new TextRun({ text: token.raw, font: FONT })] }))
    }
  }

  const doc = new Document({
    styles: { default: { document: { run: { font: FONT, size: 21 } } } },
    sections: [{ children }],
  })

  return Packer.toBlob(doc)
}
