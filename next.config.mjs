import fs from 'node:fs'
import nextra from 'nextra'

const redirects = JSON.parse(
  fs.readFileSync(new URL('./redirects.json', import.meta.url), 'utf8')
)

const withNextra = nextra({
  defaultShowCopyCode: true,
  readingTime: true,
  search: {
    codeblocks: false
  }
})

export default withNextra({
  reactStrictMode: true,
  cleanDistDir: true,
  async redirects() {
    return redirects
  },
  async headers() {
    return [
      {
        // Legacy short links under /i are plain-text payloads.
        source: '/i/:path*',
        headers: [{ key: 'Content-Type', value: 'text/plain; charset=utf-8' }]
      },
      {
        // NIP-05 identifier file needs to be readable cross-origin.
        source: '/.well-known/nostr.json',
        headers: [{ key: 'Access-Control-Allow-Origin', value: '*' }]
      }
    ]
  }
})
