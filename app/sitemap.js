import { getPosts } from './get-posts'

const SITE_URL = 'https://philihp.com'

export default async function sitemap() {
  const posts = await getPosts()
  const staticPages = ['/', '/about', '/pgp', '/lightning']

  return [
    ...staticPages.map(route => ({
      url: `${SITE_URL}${route}`,
      lastModified: new Date()
    })),
    ...posts.map(post => ({
      url: `${SITE_URL}${post.route}`,
      lastModified: new Date(post.frontMatter.date)
    }))
  ]
}
