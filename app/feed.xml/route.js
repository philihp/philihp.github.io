import { getPosts } from '../get-posts'

const SITE_URL = 'https://philihp.com'
const CONFIG = {
  title: 'Philihp Busby Blog Posts',
  description: 'Via the mind and mechanism of Philihp Busby.',
  lang: 'en-us'
}

export const dynamic = 'force-static'

const escape = str =>
  String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')

export async function GET() {
  const posts = await getPosts()
  const items = posts
    .map(post => {
      const url = `${SITE_URL}${post.route}`
      return `    <item>
      <title>${escape(post.frontMatter.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(post.frontMatter.date).toUTCString()}</pubDate>
    </item>`
    })
    .join('\n')

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escape(CONFIG.title)}</title>
    <link>${SITE_URL}/</link>
    <atom:link href="${SITE_URL}/feed.xml" rel="self" type="application/rss+xml"/>
    <description>${escape(CONFIG.description)}</description>
    <language>${CONFIG.lang}</language>
${items}
  </channel>
</rss>`

  return new Response(xml, {
    headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' }
  })
}
