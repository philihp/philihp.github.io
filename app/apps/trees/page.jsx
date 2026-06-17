import Link from 'next/link'
import { useMDXComponents } from '../../../mdx-components'
import { resolveLocation } from '../../geo'
import LocationTable from '../../location-table'
import { LiveTrees } from '../../tree/live'
import ToyNav from '../toy-nav'

export const metadata = {
  title: 'Nearby Trees',
  description:
    'San Francisco street trees within 50 metres of your location, sorted by distance.'
}

export const dynamic = 'force-dynamic'

const Wrapper = useMDXComponents().wrapper

async function fetchTrees(lat, lon) {
  if (lat === null || lon === null) return []
  try {
    const url =
      `https://data.sfgov.org/resource/tkzw-k3nq.json` +
      `?$where=within_circle(location,${lat},${lon},50)&$limit=200`
    const res = await fetch(url, { cache: 'no-store' })
    if (!res.ok) return []
    return await res.json()
  } catch {
    return []
  }
}

export default async function TreesPage() {
  const loc = await resolveLocation()
  const trees = await fetchTrees(loc.effLat, loc.effLon)

  return (
    <Wrapper metadata={{ title: 'Nearby Trees' }}>
      <ToyNav />
      <h2>Location &amp; Time</h2>
      <LocationTable loc={loc} showClock={false} />

      <h2>Nearest trees within 50 m</h2>
      <p>
        {loc.usingDeviceLocation
          ? 'Using your device location.'
          : 'Using the Vercel IP-based location estimate.'}
      </p>
      <LiveTrees
        lat={loc.effLat}
        lon={loc.effLon}
        trees={trees}
        usingDeviceLocation={loc.usingDeviceLocation}
      />

      <p>
        <Link href="/apps/sun">Where is the Sun? →</Link>
      </p>
      <p>
        Tree data from the{' '}
        <a href="https://data.sfgov.org/City-Infrastructure/Street-Tree-List/tkzw-k3nq">
          SF Department of Public Works Street Tree List
        </a>
        .
      </p>
    </Wrapper>
  )
}
