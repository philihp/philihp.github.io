// Converts Jekyll `_posts/*` and the standalone pages into Nextra's
// content-directory format, preserving the `/:year/:slug.html` permalinks.
//
//   _posts/2022-10-04-coerce-string-into-uuid-in-postgres.md
//     -> content/2022/coerce-string-into-uuid-in-postgres.html.md   (route /2022/coerce-string-into-uuid-in-postgres.html)
//
// It also harvests every `redirect_from` entry (plus the legacy redirects that
// used to live in vercel.json) into redirects.json, consumed by next.config.mjs.
//
// Posts are written as `.md` so Nextra compiles them as CommonMark with
// rehype-raw — raw HTML passes through verbatim, exactly like Jekyll/kramdown.
// The one interactive post (pointille) is maintained by hand as `.mdx`, so it
// is skipped here.

import fs from 'node:fs'
import path from 'node:path'

const ROOT = path.resolve(import.meta.dirname, '..')
const POSTS_DIR = path.join(ROOT, '_posts')
const CONTENT_DIR = path.join(ROOT, 'content')

// Hand-maintained posts (interactive / inline <script>) — do not auto-convert.
const SKIP = new Set(['2026-05-13-announcing-pointille.md'])

const redirects = []
const addRedirect = (source, destination, permanent = true) => {
  let s = String(source).trim()
  if (!s) return
  if (!s.startsWith('/') && !s.startsWith('http')) s = '/' + s
  // Next.js matches the path without a trailing slash (trailingSlash: false),
  // so normalise the source to its no-trailing-slash form.
  if (s.length > 1) s = s.replace(/\/+$/, '')
  redirects.push({ source: s, destination, permanent })
}

// --- lenient frontmatter parser ----------------------------------------------
// Pulls only title/date/tags/redirect_from, tolerating the messy YAML
// (`meta:` blobs, blogger export cruft) found in the WordPress-era posts.
function parse(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/)
  if (!m) return { fm: {}, body: raw }
  const [, head, body] = m
  const lines = head.split(/\r?\n/)
  const fm = { tags: [], redirect_from: [] }
  const unquote = v =>
    v.trim().replace(/^['"]/, '').replace(/['"]$/, '').trim()

  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    const km = line.match(/^([A-Za-z0-9_]+):\s?(.*)$/)
    if (!km) {
      i++
      continue
    }
    const key = km[1]
    const val = km[2]
    if (key === 'tags' || key === 'redirect_from' || key === 'categories') {
      if (val.trim().startsWith('[')) {
        fm[key] = val
          .trim()
          .replace(/^\[/, '')
          .replace(/\]$/, '')
          .split(',')
          .map(unquote)
          .filter(Boolean)
        i++
      } else {
        const arr = []
        i++
        while (i < lines.length && /^\s*-\s+/.test(lines[i])) {
          arr.push(unquote(lines[i].replace(/^\s*-\s+/, '')))
          i++
        }
        fm[key] = arr
      }
      continue
    }
    // scalar key
    fm[key] = unquote(val)
    i++
    // skip any nested/indented block belonging to this key (author:, meta:, ...)
    while (i < lines.length && /^\s+\S/.test(lines[i])) i++
  }
  return { fm, body }
}

function dumpFrontmatter(fm) {
  const out = ['---']
  out.push(`title: ${JSON.stringify(fm.title ?? '')}`)
  out.push(`date: ${fm.date}`)
  if (fm.tags && fm.tags.length) {
    out.push('tags:')
    for (const t of fm.tags) out.push(`  - ${JSON.stringify(t)}`)
  }
  out.push(`author: ${JSON.stringify(fm.author)}`)
  out.push('---')
  return out.join('\n')
}

function transformBody(body) {
  return body
    .replace(/\{\{\s*post\.baseurl\s*\}\}/g, '')
    .replace(/\{%\s*raw\s*%\}/g, '')
    .replace(/\{%\s*endraw\s*%\}/g, '')
}

function normalizeDate(value, fallback) {
  if (value) {
    const d = String(value).match(/^(\d{4}-\d{2}-\d{2})/)
    if (d) return d[1]
  }
  return fallback
}

// --- posts -------------------------------------------------------------------
let count = 0
for (const file of fs.readdirSync(POSTS_DIR).sort()) {
  if (!/\.(md|html)$/.test(file)) continue
  if (file.includes('.fr.')) continue // English only
  if (SKIP.has(file)) continue
  const m = file.match(/^(\d{4})-(\d{2})-(\d{2})-(.+)\.(md|html)$/)
  if (!m) {
    console.warn('skip (no date prefix):', file)
    continue
  }
  const [, year, mo, day, slug] = m
  const route = `/${year}/${slug}.html`
  const raw = fs.readFileSync(path.join(POSTS_DIR, file), 'utf8')
  const { fm, body } = parse(raw)

  for (const src of fm.redirect_from || []) addRedirect(src, route)

  const outFm = {
    title: fm.title || slug,
    date: normalizeDate(fm.date, `${year}-${mo}-${day}`),
    tags: fm.tags,
    author: 'Philihp Busby'
  }

  const outPath = path.join(CONTENT_DIR, year, `${slug}.html.md`)
  fs.mkdirSync(path.dirname(outPath), { recursive: true })
  fs.writeFileSync(outPath, dumpFrontmatter(outFm) + '\n\n' + transformBody(body).trimStart())
  count++
}

// --- standalone pages --------------------------------------------------------
const PAGES = [
  { src: 'about.md', out: 'about.md' },
  { src: 'pgp.md', out: 'pgp.md' },
  { src: 'lightning.md', out: 'lightning.md' }
]
for (const { src, out } of PAGES) {
  const raw = fs.readFileSync(path.join(ROOT, src), 'utf8')
  const { fm, body } = parse(raw)
  const route = (fm.permalink || `/${out.replace(/\.md$/, '')}`).replace(/\/$/, '')
  for (const r of fm.redirect_from || []) addRedirect(r, route)
  const lines = ['---', `title: ${JSON.stringify(fm.title || '')}`, '---']
  fs.writeFileSync(
    path.join(CONTENT_DIR, out),
    lines.join('\n') + '\n\n' + transformBody(body).trim() + '\n'
  )
}

// home (index.md) -> redirects only; the listing lives in app/page.jsx
{
  const raw = fs.readFileSync(path.join(ROOT, 'index.md'), 'utf8')
  const { fm } = parse(raw)
  for (const r of fm.redirect_from || []) addRedirect(r, '/')
}

// --- legacy redirects formerly in vercel.json --------------------------------
addRedirect('/openskill.js/logo.png', '/assets/openskill-logo.png')
addRedirect('/openskill.js/logo.jpg', '/assets/openskill-logo.jpg')
addRedirect('/weblabora', 'https://github.com/philihp/weblabora', false)
addRedirect(
  '/blog/wp-content/uploads/2011/03/S2000Wiring2-150x150.png',
  '/assets/S2000Wiring.png'
)
addRedirect(
  '/blog/wp-content/uploads/2011/03/S2000Wiring2.png',
  '/assets/S2000Wiring.png'
)
// French translation was dropped — send its old URL to the English post.
addRedirect(
  '/2026/announcing-pointille.fr.html',
  '/2026/announcing-pointille.html',
  false
)

// de-duplicate (keep first destination per source)
const seen = new Set()
const deduped = redirects.filter(r => {
  if (seen.has(r.source)) return false
  seen.add(r.source)
  return true
})

fs.writeFileSync(
  path.join(ROOT, 'redirects.json'),
  JSON.stringify(deduped, null, 2) + '\n'
)

console.log(`Converted ${count} posts, ${PAGES.length} pages, ${deduped.length} redirects.`)
