import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { Container, Eyebrow } from '@/components/ui'
import { RichContent } from '@/components/rich-content'
import { getBlogPosts } from '@/lib/cms'
import { formatDate } from '@/lib/format'

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = (await getBlogPosts()).find((item) => item.slug === slug)
  if (!post) return { title: 'Journal story not found | GIH Tour and Travel' }
  return { title: post.seoTitle || `${post.title} | GIH Tour and Travel`, description: post.seoDescription || post.excerpt }
}

export async function generateStaticParams() {
  return (await getBlogPosts()).map((post) => ({ slug: post.slug }))
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = (await getBlogPosts()).find((item) => item.slug === slug)
  if (!post) notFound()
  return (
    <article>
      <section className="detail-hero"><Container><div className="breadcrumbs"><Link href="/">Home</Link><span>›</span><Link href="/blog">Journal</Link><span>›</span><span>{post.title}</span></div><div className="plain-page" style={{ paddingBottom: 35 }}><Eyebrow>{post.publishedAt ? formatDate(post.publishedAt) : 'GIH Tour and Travel'}</Eyebrow><h1 className="page-hero-title">{post.title}</h1><p className="lead">{post.excerpt}</p></div><div className="detail-image"><Image src={post.image} alt={post.imageAlt} fill priority sizes="(max-width: 900px) 92vw, 1180px" /></div></Container></section>
      <section className="section"><Container><div className="plain-page" style={{ paddingTop: 0, paddingBottom: 0 }}><RichContent value={post.body} /><p className="breadcrumbs"><Link href="/blog">← Back to the journal</Link></p></div></Container></section>
    </article>
  )
}
