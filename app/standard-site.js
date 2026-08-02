// standard.site (https://standard.site) publishes AT Protocol lexicons for
// long-form writing: a `site.standard.publication` record describing this blog,
// and a `site.standard.document` record per post.
//
// did:plc:mnbueka7mnf5ts5rzmjy34z2 is the DID behind the @philihp.com handle.
// Prefer the DID over the handle — handles can be reassigned.
export const DID = 'did:plc:mnbueka7mnf5ts5rzmjy34z2'

// Served verbatim from /.well-known/site.standard.publication, which is what
// ties the record to this domain, and echoed as a discovery hint in <head>.
// See https://standard.site/docs/verification.
export const PUBLICATION_URI = `at://${DID}/site.standard.publication/self`

// Record keys cannot contain slashes, so a post's route doubles as its rkey
// with the separators swapped: /2026/announcing-pointille.html becomes
// 2026-announcing-pointille.html. Deriving it rather than generating a TID
// keeps it stable, so re-syncing a post edits its record instead of leaving a
// second copy behind. Everything the routes produce is already within the
// record-key charset ([A-Za-z0-9._~:-]).
export const documentRkey = route => route.replace(/^\//, '').replaceAll('/', '-')

export const documentUri = route =>
  `at://${DID}/site.standard.document/${documentRkey(route)}`
