import Link from 'next/link'
import { useMDXComponents } from '../../../mdx-components'
import { resolveLocation } from '../../geo'
import LocationTable from '../../location-table'
import { LiveTimeProvider } from '../../sun/live'
import { LiveMoon } from '../../moon/live'
import ToyNav from '../toy-nav'

export const metadata = {
  title: 'Moon Position',
  description:
    'Live phase, illumination, azimuth, elevation, and distance of the moon at your location, updating in real time.'
}

export const dynamic = 'force-dynamic'

const Wrapper = useMDXComponents().wrapper

export default async function MoonPage() {
  const now = new Date()
  const loc = await resolveLocation()

  return (
    <LiveTimeProvider initialISO={now.toISOString()}>
      <Wrapper metadata={{ title: 'Moon Position' }}>
        <ToyNav />
        <h2>Location &amp; Time</h2>
        <LocationTable loc={loc} />

        <h2>Moon</h2>
        <p>
          {loc.usingDeviceLocation
            ? 'Using your device location.'
            : 'Using the Vercel IP-based location estimate.'}
        </p>
        <LiveMoon lat={loc.effLat} lon={loc.effLon} />

        <p>
          <Link href="/toys/sun">Where is the Sun? →</Link>
        </p>
        <p>
          <Link href="/toys/trees">Nearby trees →</Link>
        </p>

        <p>
          Computed from your device location when shared, otherwise the
          Vercel-provided IP estimate. The time and moon position update live.
        </p>
      </Wrapper>
    </LiveTimeProvider>
  )
}
