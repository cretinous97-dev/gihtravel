import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { Container, Eyebrow } from '@/components/ui'
import { PageHero } from '@/components/page-hero'
import { getBlogPosts } from '@/lib/cms'
import { formatDate } from '@/lib/format'

export default async function BlogPage() {
  const posts = await getBlogPosts()
  return (
    <>
      <PageHero eyebrow="Notes from Bhutan" title="The GIH travel journal." description="Stories, practical notes and moments from around the country." />
      <section className="section"><Container>
        {posts.length ? <div className="grid-3">{posts.map((post) => <article key={post.slug} className="trip-card"><Link href={`/blog/${post.slug}`} className="trip-card-image"><Image src={post.image} alt={post.imageAlt} fill sizes="(max-width: 720px) 92vw, 31vw" /></Link><div className="trip-card-content"><div className="card-meta"><span>{post.publishedAt ? formatDate(post.publishedAt) : 'GIH Tour and Travel'}</span></div><h3><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3><p className="card-description">{post.excerpt}</p><div className="trip-card-foot"><span className="price-block"><span>{post.author || 'GIH Tour and Travel'}</span></span><Link href={`/blog/${post.slug}`} className="circle-link" aria-label={`Read ${post.title}`}><ArrowUpRight size={18} /></Link></div></div></article>)}</div> : <div className="empty-state"><Eyebrow>The GIH journal</Eyebrow><h2>No journal stories have been added yet.</h2><p>GIH can publish approved stories here through the admin panel.</p></div>}
      </Container></section>
    </>
  )
}
