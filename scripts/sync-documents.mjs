// Publishes a `site.standard.document` record for every post in content/, so
// standard.site clients can discover the writing here from the AT Protocol
// side. See https://standard.site/docs/lexicons/document.
//
//   BSKY_APP_PASSWORD=xxxx-xxxx-xxxx-xxxx npm run sync-documents
//   npm run sync-documents -- --dry-run
//
// Get an app password from https://bsky.app/settings/app-passwords — this
// never wants the account password. Records are keyed by post route (see
// documentRkey), so the script is idempotent: it writes only the posts whose
// metadata actually changed, and re-running it after an edit updates the
// record in place rather than leaving a duplicate.
//
// The publication record itself is not managed here — it is written once by
// hand and rarely changes.

import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import { PUBLICATION_URI } from '../app/.well-known/site.standard.publication/route.js'
import { documentRkey } from '../app/standard-site.js'

const ROOT = path.resolve(import.meta.dirname, '..')
const CONTENT_DIR = path.join(ROOT, 'content')
const COLLECTION = 'site.standard.document'
const DID = PUBLICATION_URI.split('/')[2]

const dryRun = process.argv.includes('--dry-run')

// --- the records we want -----------------------------------------------------

const readPosts = () => {
  const files = []
  const walk = dir => {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name)
      if (entry.isDirectory()) walk(full)
      else if (/\.mdx?$/.test(entry.name)) files.push(full)
    }
  }
  walk(CONTENT_DIR)

  return files
    .map(file => {
      const { data } = matter(fs.readFileSync(file, 'utf8'))
      // Nextra strips the trailing .md/.mdx, so the file path is the route.
      const route = `/${path.relative(CONTENT_DIR, file).replace(/\.mdx?$/, '')}`
      return { route, frontMatter: data }
    })
    // Pages without a date (/about, /pgp, /lightning) are not posts.
    .filter(post => post.frontMatter.date)
    .sort((a, b) => a.route.localeCompare(b.route))
}

const buildRecord = ({ route, frontMatter }) => {
  const record = {
    $type: COLLECTION,
    site: PUBLICATION_URI,
    path: route,
    title: String(frontMatter.title),
    publishedAt: new Date(frontMatter.date).toISOString()
  }
  if (frontMatter.tags?.length) record.tags = frontMatter.tags.map(String)
  return record
}

// --- what the repo already holds ---------------------------------------------

const xrpc = async (pds, method, { body, token, params } = {}) => {
  const url = new URL(`${pds}/xrpc/${method}`)
  for (const [key, value] of Object.entries(params || {})) {
    url.searchParams.set(key, value)
  }
  const res = await fetch(url, {
    method: body ? 'POST' : 'GET',
    headers: {
      ...(body && { 'Content-Type': 'application/json' }),
      ...(token && { Authorization: `Bearer ${token}` })
    },
    ...(body && { body: JSON.stringify(body) })
  })
  if (!res.ok) {
    throw new Error(`${method} ${res.status}: ${await res.text()}`)
  }
  return res.json()
}

const resolvePds = async did => {
  const res = await fetch(`https://plc.directory/${did}`)
  if (!res.ok) throw new Error(`could not resolve ${did}: ${res.status}`)
  const doc = await res.json()
  const pds = doc.service?.find(s => s.id === '#atproto_pds')?.serviceEndpoint
  if (!pds) throw new Error(`no PDS listed in the DID document for ${did}`)
  return pds
}

const listExisting = async pds => {
  const existing = new Map()
  let cursor
  do {
    const page = await xrpc(pds, 'com.atproto.repo.listRecords', {
      params: { repo: DID, collection: COLLECTION, limit: 100, ...(cursor && { cursor }) }
    })
    for (const { uri, value } of page.records) {
      existing.set(uri.split('/').pop(), value)
    }
    cursor = page.cursor
  } while (cursor)
  return existing
}

// Key order differs between what we build and what the PDS returns, so compare
// on a stable serialisation rather than the raw JSON.
const stable = value =>
  JSON.stringify(value, (_, v) =>
    v && typeof v === 'object' && !Array.isArray(v)
      ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => a.localeCompare(b)))
      : v
  )

// --- go ----------------------------------------------------------------------

const posts = readPosts()
console.log(`${posts.length} posts in ${path.relative(ROOT, CONTENT_DIR)}/`)

const pds = await resolvePds(DID)
const existing = await listExisting(pds)
console.log(`${existing.size} ${COLLECTION} records already in ${pds}`)

const pending = posts
  .map(post => ({ rkey: documentRkey(post.route), record: buildRecord(post) }))
  .filter(({ rkey, record }) => stable(existing.get(rkey)) !== stable(record))

const orphaned = [...existing.keys()].filter(
  rkey => !posts.some(post => documentRkey(post.route) === rkey)
)
if (orphaned.length) {
  console.log(`${orphaned.length} records have no matching post, left alone:`)
  for (const rkey of orphaned) console.log(`  ${rkey}`)
}

if (!pending.length) {
  console.log('everything up to date')
  process.exit(0)
}

console.log(`${pending.length} to write:`)
for (const { rkey } of pending) console.log(`  ${rkey}`)

if (dryRun) {
  console.log('\n--dry-run, stopping here')
  process.exit(0)
}

const password = process.env.BSKY_APP_PASSWORD
if (!password) {
  console.error('\nBSKY_APP_PASSWORD is not set')
  process.exit(1)
}

const { accessJwt } = await xrpc(pds, 'com.atproto.server.createSession', {
  body: { identifier: DID, password }
})

for (const { rkey, record } of pending) {
  await xrpc(pds, 'com.atproto.repo.putRecord', {
    token: accessJwt,
    body: { repo: DID, collection: COLLECTION, rkey, record }
  })
  console.log(`wrote ${rkey}`)
}

console.log(`\ndone, ${pending.length} written`)
