import type { ReactNode } from 'react'

type LexicalNode = {
  type?: string
  text?: string
  format?: number | string
  tag?: string
  url?: string
  fields?: { url?: string; newTab?: boolean }
  children?: LexicalNode[]
}

type LexicalValue = { root?: LexicalNode }

function childrenOf(node: LexicalNode, keyPrefix: string): ReactNode[] {
  return (node.children ?? []).map((child, index) => renderNode(child, `${keyPrefix}-${index}`))
}

function renderNode(node: LexicalNode, key: string): ReactNode {
  if (node.type === 'text') {
    let value: ReactNode = node.text ?? ''
    const format = typeof node.format === 'number' ? node.format : 0
    if (format & 1) value = <strong>{value}</strong>
    if (format & 2) value = <em>{value}</em>
    if (format & 8) value = <u>{value}</u>
    if (format & 16) value = <code>{value}</code>
    return <span key={key}>{value}</span>
  }
  const children = childrenOf(node, key)
  switch (node.type) {
    case 'root': return <>{children}</>
    case 'heading': {
      const tag = node.tag === 'h1' || node.tag === 'h3' || node.tag === 'h4' ? node.tag : 'h2'
      const Heading = tag
      return <Heading key={key}>{children}</Heading>
    }
    case 'quote': return <blockquote key={key}>{children}</blockquote>
    case 'list': return node.tag === 'ol' ? <ol key={key}>{children}</ol> : <ul key={key}>{children}</ul>
    case 'listitem': return <li key={key}>{children}</li>
    case 'link': {
      const href = node.fields?.url ?? node.url ?? '#'
      const external = href.startsWith('http')
      return <a key={key} href={href} target={external ? '_blank' : undefined} rel={external ? 'noreferrer' : undefined}>{children}</a>
    }
    case 'linebreak': return <br key={key} />
    case 'paragraph': return <p key={key}>{children}</p>
    default: return <span key={key}>{children}</span>
  }
}

export function RichContent({ value }: { value: unknown }) {
  if (typeof value === 'string') {
    return <div className="plain-text">{value.split(/\n\n+/).filter(Boolean).map((paragraph, index) => <p key={index}>{paragraph}</p>)}</div>
  }
  if (value && typeof value === 'object' && 'root' in value) {
    const root = (value as LexicalValue).root
    if (root) return <div className="rich-content">{renderNode(root, 'root')}</div>
  }
  return null
}
