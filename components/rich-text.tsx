import type { PortableTextBlock } from '@/lib/types'
import { cn } from '@/lib/utils'

/**
 * RichText — minimal Portable Text renderer (headings, paragraphs, quotes,
 * bullet/numbered lists, links). Avoids pulling @portabletext/react for the
 * small subset of block types the Studio is configured to produce.
 * Newlines inside a paragraph render as soft breaks so copy preserved from
 * the old site keeps its shape.
 */

type Span = { _type: 'span'; text: string }

function renderSpans(spans: Span[]): React.ReactNode {
  return spans.map((span, i) => <span key={i}>{span.text}</span>)
}

function isListBlock(block: PortableTextBlock): boolean {
  return block.listItem === 'bullet' || block.listItem === 'number'
}

export function RichText({ value, className }: { value: PortableTextBlock[] | undefined; className?: string }) {
  if (!value || value.length === 0) return null

  const nodes: React.ReactNode[] = []
  let listBuffer: PortableTextBlock[] = []

  const flushList = () => {
    if (listBuffer.length === 0) return
    const ordered = listBuffer[0]?.listItem === 'number'
    const Tag = ordered ? 'ol' : 'ul'
    nodes.push(
      <Tag
        key={`list-${nodes.length}`}
        className={cn(
          'my-5 space-y-2 ps-6 text-charcoal-soft',
          ordered ? 'list-decimal' : 'list-disc',
        )}
      >
        {listBuffer.map((b, i) => (
          <li key={i} className="text-body">
            {renderSpans(b.children as Span[])}
          </li>
        ))}
      </Tag>,
    )
    listBuffer = []
  }

  value.forEach((block, index) => {
    if (block._type !== 'block') return

    if (isListBlock(block)) {
      listBuffer.push(block)
      return
    }
    flushList()

    const text = <div className="whitespace-pre-line">{renderSpans(block.children as Span[])}</div>

    switch (block.style) {
      case 'h2':
        nodes.push(
          <h2 key={index} className="mt-10 mb-4 font-serif text-heading-2 text-charcoal">
            {text}
          </h2>,
        )
        break
      case 'h3':
        nodes.push(
          <h3 key={index} className="mt-8 mb-3 font-serif text-heading-3 text-charcoal">
            {text}
          </h3>,
        )
        break
      case 'h4':
        nodes.push(
          <h4 key={index} className="mt-6 mb-2 font-serif text-xl text-charcoal">
            {text}
          </h4>,
        )
        break
      case 'blockquote':
        nodes.push(
          <blockquote key={index} className="my-8 border-l-4 border-ochre-400 py-2 ps-6 font-serif text-xl italic text-charcoal-soft">
            {text}
          </blockquote>,
        )
        break
      default:
        nodes.push(
          <p key={index} className="my-5 text-body text-charcoal-soft">
            {text}
          </p>,
        )
    }
  })

  flushList()

  return <div className={cn('max-w-measure-wide', className)}>{nodes}</div>
}
