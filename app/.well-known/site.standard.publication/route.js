import { PUBLICATION_URI } from '../../standard-site.js'

export const dynamic = 'force-static'

// Verifiers fetch this and compare the body to the publication record's AT-URI.
export const GET = () =>
  new Response(`${PUBLICATION_URI}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    }
  })
