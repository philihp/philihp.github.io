// Builds the Pagefind search index from the HTML that `next build` prerenders.
// It runs as the `postbuild` step:
//
//   npm run build
//
// Next.js writes the prerendered pages to one of two layouts:
//
//   .next/server/app/<path>.html
//   .next/server/route-cache/APP_PAGE/<sha256>/$/<path>.html
//
// Next.js uses the second layout when a deployment adapter is set. Vercel
// sets an adapter, and Next.js 16.4 and later use the route cache layout for
// it. Below each of these directories, <path> is the same, so each one is a
// site root for Pagefind and the search result URLs do not change.

import fs from 'node:fs'
import path from 'node:path'
import * as pagefind from 'pagefind'

const ROOT = path.resolve(import.meta.dirname, '..')
const SERVER_DIR = path.join(ROOT, '.next', 'server')
const OUTPUT_DIR = path.join(ROOT, 'public', '_pagefind')

const subdirectories = dir =>
  fs.existsSync(dir)
    ? fs
        .readdirSync(dir, { withFileTypes: true })
        .filter(entry => entry.isDirectory())
        .map(entry => path.join(dir, entry.name))
        .sort()
    : []

// The directories that hold prerendered App Router pages, in a fixed order.
export const siteRoots = serverDir =>
  [
    path.join(serverDir, 'app'),
    ...subdirectories(path.join(serverDir, 'route-cache', 'APP_PAGE')).map(
      dir => path.join(dir, '$')
    )
  ].filter(dir => fs.existsSync(dir))

// Add the directories one after the other, so that the index is the same on
// each build.
const addDirectories = (index, dirs) =>
  dirs.reduce(
    async (previous, dir) => {
      const totals = await previous
      const { errors, page_count } = await index.addDirectory({ path: dir })
      return {
        errors: [...totals.errors, ...errors],
        pageCount: totals.pageCount + page_count
      }
    },
    Promise.resolve({ errors: [], pageCount: 0 })
  )

const fail = errors => {
  throw new Error(`Pagefind failed:\n${errors.join('\n')}`)
}

const main = async () => {
  const dirs = siteRoots(SERVER_DIR)
  const { errors: createErrors, index } = await pagefind.createIndex()
  if (createErrors.length > 0) fail(createErrors)

  const { errors: addErrors, pageCount } = await addDirectories(index, dirs)
  if (addErrors.length > 0) fail(addErrors)
  if (pageCount === 0) {
    fail([`No HTML pages found below ${path.relative(ROOT, SERVER_DIR)}.`])
  }

  const { errors: writeErrors } = await index.writeFiles({
    outputPath: OUTPUT_DIR
  })
  if (writeErrors.length > 0) fail(writeErrors)

  console.log(
    `Pagefind: read ${pageCount} HTML files from ${dirs.length} site root(s), wrote ${path.relative(ROOT, OUTPUT_DIR)}`
  )
}

if (import.meta.main) {
  try {
    await main()
  } finally {
    await pagefind.close()
  }
}
