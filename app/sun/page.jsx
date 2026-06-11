import Link from 'next/link'
import { useMDXComponents } from '../../mdx-components'
import { resolveLocation } from '../geo'
import LocationTable from '../location-table'
import DeviceLocationButton from './device-location-button'
import { LiveSun, LiveTimeProvider } from './live'

export const metadata = {
  title: 'Sun Position',
  description:
    'Live azimuth and elevation of the sun at your location, updating in real time.'
}

// Server component so we can read the Vercel-provided location. The time and
// sun position are then re-rendered live in the browser.
// `force-dynamic` keeps the location/request data fresh per request.
export const dynamic = 'force-dynamic'

// The blog theme's content wrapper, so this page gets the same heading, meta
// bar, container width, and typography as every other page on the site.
const Wrapper = useMDXComponents().wrapper

export default async function SunPage() {
  const now = new Date()
  const loc = await resolveLocation()

  return (
    <LiveTimeProvider initialISO={now.toISOString()}>
      <Wrapper metadata={{ title: 'Sun Position' }}>
        <h2>Location &amp; Time</h2>
        <LocationTable loc={loc} />

        <h2>Sun</h2>
        <p>
          {loc.usingDeviceLocation
            ? 'Using your device location.'
            : 'Using the Vercel IP-based location estimate.'}
        </p>
        <LiveSun lat={loc.effLat} lon={loc.effLon} />

        <DeviceLocationButton />

        <p>
          <Link href="/moon">Where is the Moon? →</Link>
        </p>

        <p>
          Computed from your device location when shared, otherwise the
          Vercel-provided IP estimate. The time and sun position update live.
        </p>
      </Wrapper>
    </LiveTimeProvider>
  )
}
