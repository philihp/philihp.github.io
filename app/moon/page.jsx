import Link from 'next/link'
import { useMDXComponents } from '../../mdx-components'
import { resolveLocation } from '../geo'
import LocationTable from '../location-table'
import DeviceLocationButton from '../sun/device-location-button'
import { LiveTimeProvider } from '../sun/live'
import { LiveMoon } from './live'

export const metadata = {
  title: 'Moon Position',
  description:
    'Live phase, illumination, azimuth, elevation, and distance of the moon at your location, updating in real time.'
}

// Server component so we can read the Vercel-provided location. The time and
// moon position are then re-rendered live in the browser.
// `force-dynamic` keeps the location/request data fresh per request.
export const dynamic = 'force-dynamic'

// The blog theme's content wrapper, so this page gets the same heading, meta
// bar, container width, and typography as every other page on the site.
const Wrapper = useMDXComponents().wrapper

export default async function MoonPage() {
  const now = new Date()
  const loc = await resolveLocation()

  return (
    <LiveTimeProvider initialISO={now.toISOString()}>
      <Wrapper metadata={{ title: 'Moon Position' }}>
        <h2>Location &amp; Time</h2>
        <LocationTable loc={loc} />

        <h2>Moon</h2>
        <p>
          {loc.usingDeviceLocation
            ? 'Using your device location.'
            : 'Using the Vercel IP-based location estimate.'}
        </p>
        <LiveMoon lat={loc.effLat} lon={loc.effLon} />

        <DeviceLocationButton />

        <p>
          <Link href="/sun">Where is the Sun? →</Link>
        </p>

        <p>
          Computed from your device location when shared, otherwise the
          Vercel-provided IP estimate. The time and moon position update live.
        </p>
      </Wrapper>
    </LiveTimeProvider>
  )
}
