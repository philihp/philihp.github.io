import Link from 'next/link'

export const metadata = {
  title: '404'
}

export default function NotFound() {
  return (
    <div style={{ textAlign: 'center', margin: '3rem auto', maxWidth: 600 }}>
      <h1 style={{ fontSize: '4em', margin: '30px 0', lineHeight: 1 }}>404</h1>
      <p>
        <strong>Page not found :(</strong>
      </p>
      <p>The requested page could not be found.</p>
      <p>
        <Link href="/">← Back home</Link>
      </p>
    </div>
  )
}
