import { test } from 'node:test'
import assert from 'node:assert/strict'
import fs from 'node:fs'
import os from 'node:os'
import path from 'node:path'
import { siteRoots } from './build-search-index.mjs'

const makeServerDir = files => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'search-index-'))
  files.forEach(file => {
    fs.mkdirSync(path.dirname(path.join(dir, file)), { recursive: true })
    fs.writeFileSync(path.join(dir, file), '<html></html>')
  })
  return dir
}

const relativeRoots = dir =>
  siteRoots(dir).map(root => path.relative(dir, root))

test('finds the app directory when Next.js has no adapter', () => {
  const dir = makeServerDir([
    'app/index.html',
    'app/2020/post.html.html',
    'pages/404.html'
  ])
  assert.deepEqual(relativeRoots(dir), ['app'])
})

test('finds each route cache root when Next.js has an adapter', () => {
  const dir = makeServerDir([
    'app/page.js',
    'route-cache/APP_PAGE/bbbb/$/2020/post.html.html',
    'route-cache/APP_PAGE/aaaa/$/index.html',
    'route-cache/APP_ROUTE/cccc/$/feed.xml.body',
    'pages/404.html'
  ])
  assert.deepEqual(relativeRoots(dir), [
    'app',
    path.join('route-cache', 'APP_PAGE', 'aaaa', '$'),
    path.join('route-cache', 'APP_PAGE', 'bbbb', '$')
  ])
})

test('finds nothing when there is no build output', () => {
  const dir = makeServerDir([])
  assert.deepEqual(relativeRoots(dir), [])
})
