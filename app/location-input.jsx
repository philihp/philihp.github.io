'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

function setLocationCookie(lat, lon) {
  const value = encodeURIComponent(JSON.stringify({ lat, lon }))
  document.cookie = `device-geo=${value}; path=/; max-age=31536000; samesite=lax`
}

function GpsIcon({ spinning }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="15"
      height="15"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      style={spinning ? { animation: 'spin 1s linear infinite' } : undefined}
    >
      <path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3A8.994 8.994 0 0 0 13 3.06V1h-2v2.06A8.994 8.994 0 0 0 3.06 11H1v2h2.06A8.994 8.994 0 0 0 11 20.94V23h2v-2.06A8.994 8.994 0 0 0 20.94 13H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" />
    </svg>
  )
}

export default function GpsButton() {
  const router = useRouter()
  const [locating, setLocating] = useState(false)
  const [error, setError] = useState(null)

  const handleGps = () => {
    if (!('geolocation' in navigator)) {
      setError('Geolocation not supported.')
      return
    }
    setLocating(true)
    setError(null)
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLocationCookie(pos.coords.latitude, pos.coords.longitude)
        setLocating(false)
        router.refresh()
      },
      err => {
        setError(err.message)
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  return (
    <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
      <button
        type="button"
        className="location-gps-button"
        onClick={handleGps}
        disabled={locating}
        title={locating ? 'Locating…' : 'Use my device location'}
      >
        <GpsIcon spinning={locating} />
      </button>
      {error && <span className="location-gps-error">{error}</span>}
    </span>
  )
}
