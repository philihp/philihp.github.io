'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

// Asks the browser for the device's geolocation, stashes it in a cookie, then
// refreshes so the server component can render it next to the Vercel location.
export default function DeviceLocationButton() {
  const router = useRouter()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  const request = () => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation is not supported by this browser.')
      return
    }
    setLoading(true)
    setError(null)
    navigator.geolocation.getCurrentPosition(
      pos => {
        const { latitude, longitude } = pos.coords
        const value = encodeURIComponent(
          JSON.stringify({ lat: latitude, lon: longitude })
        )
        // One year, scoped to the whole site.
        document.cookie = `device-geo=${value}; path=/; max-age=31536000; samesite=lax`
        router.refresh()
        setLoading(false)
      },
      err => {
        setError(err.message)
        setLoading(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  return (
    <p>
      <button onClick={request} disabled={loading}>
        {loading ? 'Locating…' : 'Use my device location'}
      </button>
      {error && <span style={{ marginLeft: '.5rem' }}>{error}</span>}
    </p>
  )
}
