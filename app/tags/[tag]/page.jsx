import Link from 'next/link'
import { getPosts, getTags } from '../../get-posts'

export async function generateStaticParams() {
  const tags = await getTags()
  return [...new Set(tags)].map(tag => ({ tag }))
}

export async function generateMetadata(props) {
  const { tag } = await props.params
  return {
    title: `Posts tagged “${decodeURIComponent(tag)}”`
  }
}

export default async function TagPage(props) {
  const { tag } = await props.params
  const decoded = decodeURIComponent(tag)
  const posts = (await getPosts()).filter(post =>
    (post.frontMatter.tags || []).includes(decoded)
  )

  return (
    <div data-pagefind-ignore="all">
      <h1>Posts tagged “{decoded}”</h1>
      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        {posts.map(post => (
          <li key={post.route} style={{ margin: '.4rem 0' }}>
            <time
              dateTime={post.frontMatter.date}
              style={{ opacity: 0.6, marginRight: '.75rem' }}
            >
              {post.frontMatter.date}
            </time>
            <Link href={post.route}>{post.frontMatter.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
