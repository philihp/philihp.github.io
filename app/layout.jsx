import { Footer, Layout, Navbar, ThemeSwitch } from 'nextra-theme-blog'
import { Head, Search } from 'nextra/components'
import { getPageMap } from 'nextra/page-map'
import 'nextra-theme-blog/style.css'
import './computer-modern.css'

const SITE_URL = 'https://philihp.com'

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'Philihp Busby',
    template: '%s – Philihp Busby'
  },
  description: 'Via the mind and mechanism of Philihp Busby.',
  alternates: {
    types: {
      'application/rss+xml': `${SITE_URL}/feed.xml`
    }
  }
}

const SOCIAL = [
  ['GitHub', 'https://github.com/philihp'],
  ['Bluesky', 'https://bsky.app/profile/philihp.com'],
  ['LinkedIn', 'https://linkedin.com/in/philihp'],
  ['Instagram', 'https://instagram.com/philihp'],
  ['Keybase', 'https://keybase.io/philihp']
]

export default async function RootLayout({ children }) {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA

  return (
    <html lang="en" suppressHydrationWarning>
      <Head />
      <link rel="stylesheet" href="/assets/fonts/fonts.css" />
      <body>
        <Layout>
          <Navbar pageMap={await getPageMap()}>
            <Search />
            <ThemeSwitch />
          </Navbar>

          {children}

          <Footer>
            <div style={{ width: '100%' }}>
              <p>
                {SOCIAL.map(([name, href], i) => (
                  <span key={href}>
                    {i > 0 && ' · '}
                    <a href={href} rel="me">
                      {name}
                    </a>
                  </span>
                ))}
                <a href="/feed.xml" style={{ float: 'right' }}>
                  RSS
                </a>
              </p>
              <p style={{ fontSize: '.85em', opacity: 0.7 }}>
                {sha ? (
                  <>
                    Built from{' '}
                    <a
                      href={`https://github.com/philihp/philihp.github.io/tree/${sha}`}
                    >
                      {sha.slice(0, 8)}
                    </a>{' '}
                  </>
                ) : null}
                <a href="https://creativecommons.org/licenses/by/4.0/">
                  CC BY 4.0
                </a>{' '}
                — with love from San Francisco.
              </p>
            </div>
          </Footer>
        </Layout>
      </body>
    </html>
  )
}
