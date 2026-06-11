import { cookies, headers } from 'next/headers'

// Shared location resolution for the /sun and /moon pages: the Vercel
// IP-derived estimate from the request headers, plus the more accurate
// device location the browser may have shared via the "Use my device
// location" button (stored in the `device-geo` cookie).

export const parseFloatOrNull = raw => {
  if (raw === undefined || raw === null || raw.trim() === '') return null
  const n = Number(raw)
  return Number.isFinite(n) ? n : null
}

const decodeHeader = raw => {
  if (raw === undefined || raw === null || raw.trim() === '') return null
  try {
    return decodeURIComponent(raw)
  } catch {
    return raw
  }
}

// Reverse-geocode a coordinate to "city, state, COUNTRY" via OpenStreetMap's
// Nominatim service. Returns null on any failure so the page still renders.
const reverseGeocode = async (lat, lon) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=10`,
      {
        cache: 'no-store',
        headers: { 'User-Agent': 'philihp.com/sun-moon-pages' }
      }
    )
    if (!res.ok) return null
    const data = await res.json()
    const a = data.address ?? {}
    const city =
      a.city ?? a.town ?? a.village ?? a.hamlet ?? a.county ?? a.suburb
    const parts = [
      city,
      a.state,
      typeof a.country_code === 'string'
        ? a.country_code.toUpperCase()
        : a.country
    ].filter(p => typeof p === 'string' && p.length > 0)
    return parts.length > 0 ? parts.join(', ') : null
  } catch {
    return null
  }
}

export const resolveLocation = async () => {
  // Vercel populates these geolocation headers automatically from the
  // visitor's IP. Fall back to env vars so it also works in local dev.
  const h = await headers()
  const lat =
    parseFloatOrNull(h.get('x-vercel-ip-latitude')) ??
    parseFloatOrNull(process.env.VERCEL_LATITUDE ?? process.env.LATITUDE)
  const lon =
    parseFloatOrNull(h.get('x-vercel-ip-longitude')) ??
    parseFloatOrNull(process.env.VERCEL_LONGITUDE ?? process.env.LONGITUDE)

  // Vercel's estimate of the place behind that IP. The city is URL-encoded.
  const place = [
    decodeHeader(h.get('x-vercel-ip-city')),
    decodeHeader(h.get('x-vercel-ip-country-region')),
    decodeHeader(h.get('x-vercel-ip-country'))
  ]
    .filter(part => part !== null)
    .join(', ')

  // Location the browser shared via the "Use my device location" button,
  // saved to a cookie so we can compare it against the Vercel IP estimate.
  const cookieStore = await cookies()
  let deviceLat = null
  let deviceLon = null
  const deviceRaw = cookieStore.get('device-geo')?.value
  if (deviceRaw) {
    try {
      const parsed = JSON.parse(decodeURIComponent(deviceRaw))
      deviceLat = parseFloatOrNull(String(parsed.lat))
      deviceLon = parseFloatOrNull(String(parsed.lon))
    } catch {
      // Ignore a malformed cookie.
    }
  }

  // For a user-provided location, reverse-geocode it to a city.
  const devicePlace =
    deviceLat !== null && deviceLon !== null
      ? await reverseGeocode(deviceLat, deviceLon)
      : null

  // Compute from the browser-shared device location when we have it: it is
  // the visitor's actual position, whereas the Vercel headers are only an IP
  // estimate that can be hundreds of kilometres off (enough to flip the sun
  // or moon above/below the horizon). Fall back to the IP estimate otherwise.
  const usingDeviceLocation = deviceLat !== null && deviceLon !== null

  return {
    lat,
    lon,
    place,
    deviceLat,
    deviceLon,
    devicePlace,
    effLat: deviceLat ?? lat,
    effLon: deviceLon ?? lon,
    usingDeviceLocation
  }
}
