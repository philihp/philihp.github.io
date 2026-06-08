import Link from 'next/link'
import { getPosts } from './get-posts'

export const metadata = {
  title: 'Posts'
}

export default async function HomePage() {
  const posts = await getPosts()

  return (
    <div className="home" data-pagefind-ignore="all">
      <h1>Posts</h1>
      <ul style={{ listStyle: 'none', paddingLeft: 0 }}>
        {posts.map(post => (
          <li key={post.route} style={{ margin: '.4rem 0' }}>
            <time
              dateTime={post.frontMatter.date}
              style={{
                opacity: 0.6,
                marginRight: '.75rem',
                fontFamily: 'monospace'
              }}
            >
              {post.frontMatter.date}
            </time>
            <Link href={post.route}>{post.frontMatter.title}</Link>
          </li>
        ))}
      </ul>
      <p>
        subscribe <a href="/feed.xml">via RSS</a>
      </p>
    </div>
  )
}
