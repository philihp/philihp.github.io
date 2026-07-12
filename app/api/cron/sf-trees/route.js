import { put } from '@vercel/blob'

// Daily cron that pulls the San Francisco street-tree list from the city's
// open-data portal (Socrata) and caches it as a single JSON blob in Vercel
// Blob storage — the cheapest first-party durable store on the platform.
//
// The `/apps/trees` toy currently hits data.sfgov.org live on every request;
// this snapshot gives us a stable, self-hosted copy to read from instead.
//
// Wired up in vercel.json under `crons`. Vercel invokes it once a day and,
// when CRON_SECRET is set, sends `Authorization: Bearer <CRON_SECRET>`.

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'
// The full dataset is ~190k rows; give the pull room to paginate.
export const maxDuration = 300

const DATASET = 'tkzw-k3nq' // SF DPW Street Tree List
const SOURCE = `https://data.sfgov.org/resource/${DATASET}.json`
const BLOB_PATH = 'sf-trees/latest.json'
const PAGE_SIZE = 50000
const MAX_PAGES = 20 // safety cap: 1M rows

// Only the columns the `/apps/trees` UI actually renders — keeping the
// projection lean keeps the stored blob (and its bill) small.
const FIELDS = [
  'treeid',
  'qspecies',
  'qaddress',
  'qlegalstatus',
  'qcaretaker',
  'qsiteinfo',
  'dbh',
  'plantdate',
  'latitude',
  'longitude'
]

async function fetchPage(offset) {
  const params = new URLSearchParams({
    $select: FIELDS.join(','),
    $where: 'latitude IS NOT NULL AND longitude IS NOT NULL',
    $order: 'treeid',
    $limit: String(PAGE_SIZE),
    $offset: String(offset)
  })
  const headers = { Accept: 'application/json' }
  // Optional Socrata app token lifts the anonymous rate limit.
  if (process.env.SF_APP_TOKEN) headers['X-App-Token'] = process.env.SF_APP_TOKEN

  const res = await fetch(`${SOURCE}?${params}`, { headers, cache: 'no-store' })
  if (!res.ok) {
    throw new Error(`Socrata responded ${res.status} at offset ${offset}`)
  }
  return res.json()
}

export async function GET(request) {
  const auth = request.headers.get('authorization')
  if (process.env.CRON_SECRET && auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const rows = []
    for (let page = 0; page < MAX_PAGES; page++) {
      const batch = await fetchPage(page * PAGE_SIZE)
      rows.push(...batch)
      if (batch.length < PAGE_SIZE) break
    }

    const payload = JSON.stringify({
      dataset: DATASET,
      source: SOURCE,
      fetchedAt: new Date().toISOString(),
      count: rows.length,
      trees: rows
    })

    const blob = await put(BLOB_PATH, payload, {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false,
      allowOverwrite: true,
      cacheControlMaxAge: 86400
    })

    return Response.json({ ok: true, count: rows.length, url: blob.url })
  } catch (err) {
    return Response.json({ ok: false, error: String(err) }, { status: 500 })
  }
}
