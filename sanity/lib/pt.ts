import type { PortableTextBlock } from '@/lib/types'

/**
 * Portable Text helpers: tiny builders for seed content plus a tolerant
 * plain-text → blocks converter used to preserve the old site's copy
 * word-for-word (paragraphs, headings, bullet/numbered lists).
 */

let keyCounter = 0
function key(prefix = 'b'): string {
  keyCounter += 1
  return `${prefix}${keyCounter}`
}

/** Reset key counter (used by tests for deterministic keys). */
export function resetBlockKeys(): void {
  keyCounter = 0
}

export function paragraph(text: string): PortableTextBlock {
  return {
    _type: 'block',
    _key: key(),
    style: 'normal',
    children: [{ _type: 'span', _key: key('s'), text }],
  }
}

export function heading(text: string, style: 'h2' | 'h3' | 'h4' = 'h2'): PortableTextBlock {
  return {
    _type: 'block',
    _key: key(),
    style,
    children: [{ _type: 'span', _key: key('s'), text }],
  }
}

export function quote(text: string): PortableTextBlock {
  return {
    _type: 'block',
    _key: key(),
    style: 'blockquote',
    children: [{ _type: 'span', _key: key('s'), text }],
  }
}

export function listItem(text: string, ordered = false): PortableTextBlock {
  return {
    _type: 'block',
    _key: key(),
    style: 'normal',
    listItem: ordered ? 'number' : 'bullet',
    level: 1,
    children: [{ _type: 'span', _key: key('s'), text }],
  }
}

const BULLET = /^[-•*]\s+/
const NUMBERED = /^\d+[.)]\s+/
const MARKDOWN_HEADING = /^(#{2,4})\s+/

/** Is this line a shouty section header like "THE FOUR PILLARS OF GNH:"? */
function looksLikeHeading(line: string): boolean {
  const t = line.trim()
  if (t.length < 4 || t.length > 90) return false
  const letters = t.replace(/[^A-Za-z]/g, '')
  if (letters.length < 4) return false
  const upper = letters.replace(/[^A-Z]/g, '')
  return upper.length / letters.length > 0.85
}

/**
 * Convert plain text (e.g. the old site's page copy) into Portable Text.
 * - Blank lines separate paragraphs
 * - Lines starting with "- " become bullets; "1. " become numbered items
 * - "## X" markdown headings and ALL-CAPS lines become h2/h3 headings
 * Text itself is never altered.
 */
export function textToBlocks(text: string): PortableTextBlock[] {
  const blocks: PortableTextBlock[] = []
  const chunks = text.replace(/\r\n/g, '\n').trim().split(/\n{2,}/)

  for (const chunk of chunks) {
    const lines = chunk.split('\n').map((l) => l.trim()).filter(Boolean)
    if (lines.length === 0) continue

    let buffer: string[] = []
    const flushParagraph = () => {
      if (buffer.length > 0) {
        blocks.push(paragraph(buffer.join('\n')))
        buffer = []
      }
    }

    for (const line of lines) {
      const md = line.match(MARKDOWN_HEADING)
      if (md) {
        flushParagraph()
        const level = md[1]?.length === 2 ? 'h2' : md[1]?.length === 3 ? 'h3' : 'h4'
        blocks.push(heading(line.replace(MARKDOWN_HEADING, ''), level))
        continue
      }
      if (BULLET.test(line)) {
        flushParagraph()
        blocks.push(listItem(line.replace(BULLET, '')))
        continue
      }
      if (NUMBERED.test(line)) {
        flushParagraph()
        blocks.push(listItem(line.replace(NUMBERED, ''), true))
        continue
      }
      if (looksLikeHeading(line)) {
        flushParagraph()
        blocks.push(heading(line.replace(/:$/, ''), line.length > 40 ? 'h3' : 'h2'))
        continue
      }
      buffer.push(line)
    }
    flushParagraph()
  }
  return blocks
}

/** First sentence of a string, capped at `max` characters (for card blurbs). */
export function firstSentence(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, ' ').trim()
  const match = clean.match(/^(.*?[.!?])(\s|$)/)
  const sentence = match?.[1] ?? clean
  if (sentence.length <= max) return sentence
  const cut = clean.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return `${cut.slice(0, lastSpace > 40 ? lastSpace : max).replace(/[,. ;:]+$/, '')}…`
}

/** Plain-text rendering of Portable Text (for meta descriptions). */
export function blocksToPlainText(blocks: PortableTextBlock[] | undefined): string {
  if (!blocks) return ''
  return blocks
    .map((b) => b.children.map((c) => c.text).join(''))
    .join('\n')
    .trim()
}
