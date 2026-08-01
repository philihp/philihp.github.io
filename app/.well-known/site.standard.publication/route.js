// standard.site (https://standard.site) publishes AT Protocol lexicons for
// long-form writing. A `site.standard.publication` record describes this blog,
// and is only trusted once this endpoint points back at it. Verifiers fetch
// this and compare the body to the record's AT-URI.
// See https://standard.site/docs/verification.
//
// did:plc:mnbueka7mnf5ts5rzmjy34z2 is the DID behind the @philihp.com handle.
// Prefer the DID over the handle here — handles can be reassigned.
export const PUBLICATION_URI =
  'at://did:plc:mnbueka7mnf5ts5rzmjy34z2/site.standard.publication/self'

export const dynamic = 'force-static'

export const GET = () =>
  new Response(`${PUBLICATION_URI}\n`, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    }
  })
