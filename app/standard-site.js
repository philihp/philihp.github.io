import { PUBLICATION_URI } from './.well-known/site.standard.publication/route.js'

// at://<did>/site.standard.publication/self
const DID = PUBLICATION_URI.split('/')[2]

// Record keys cannot contain slashes, so a post's route doubles as its rkey
// with the separators swapped: /2026/announcing-pointille.html becomes
// 2026-announcing-pointille.html. Deriving it rather than generating a TID
// keeps it stable, so re-syncing a post edits its record instead of leaving a
// second copy behind. Everything the routes produce is already within the
// record-key charset ([A-Za-z0-9._~:-]).
export const documentRkey = route => route.replace(/^\//, '').replaceAll('/', '-')

export const documentUri = route =>
  `at://${DID}/site.standard.document/${documentRkey(route)}`
