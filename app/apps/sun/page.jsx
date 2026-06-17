import Link from 'next/link'
import { useMDXComponents } from '../../../mdx-components'
import { resolveLocation } from '../../geo'
import LocationTable from '../../location-table'
import { LiveSun, LiveTimeProvider } from '../../sun/live'
import ToyNav from '../toy-nav'

export const metadata = {
  title: 'Sun Position',
  description:
    'Live azimuth and elevation of the sun at your location, updating in real time.'
}

export const dynamic = 'force-dynamic'

const Wrapper = useMDXComponents().wrapper

export default async function SunPage() {
  const now = new Date()
  const loc = await resolveLocation()

  return (
    <LiveTimeProvider initialISO={now.toISOString()}>
      <Wrapper metadata={{ title: 'Sun Position' }}>
        <ToyNav />
        <h2>Location &amp; Time</h2>
        <LocationTable loc={loc} />

        <h2>Sun</h2>
        <p>
          {loc.usingDeviceLocation
            ? 'Using your device location.'
            : 'Using the Vercel IP-based location estimate.'}
        </p>
        <LiveSun lat={loc.effLat} lon={loc.effLon} />

        <p>
          <Link href="/apps/moon">Where is the Moon? →</Link>
        </p>
        <p>
          <Link href="/apps/trees">Nearby trees →</Link>
        </p>

        <p>
          Computed from your device location when shared, otherwise the
          Vercel-provided IP estimate. The time and sun position update live.
        </p>
      </Wrapper>
    </LiveTimeProvider>
  )
}
