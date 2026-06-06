import { getPageMap } from 'nextra/page-map'

// Posts live at /:year/:slug.html, so they are nested one folder deep in the
// page map. Walk the whole tree and treat anything carrying a `date` in its
// front matter as a post.
export async function getPosts() {
  const pageMap = await getPageMap('/')
  const posts = []

  const walk = items => {
    for (const item of items) {
      if (item.children) {
        walk(item.children)
      } else if (item.frontMatter?.date) {
        posts.push(item)
      }
    }
  }
  walk(pageMap)

  return posts.sort(
    (a, b) => +new Date(b.frontMatter.date) - +new Date(a.frontMatter.date)
  )
}

export async function getTags() {
  const posts = await getPosts()
  return posts.flatMap(post => post.frontMatter.tags || [])
}
