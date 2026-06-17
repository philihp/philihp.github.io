'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'

async function nominatimSearch(query) {
  if (!query || query.length < 3) return []
  const url =
    `https://nominatim.openstreetmap.org/search` +
    `?format=jsonv2&q=${encodeURIComponent(query)}&limit=5&addressdetails=0`
  const res = await fetch(url)
  if (!res.ok) return []
  return await res.json()
}

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

export default function LocationInput({ initialPlace }) {
  const router = useRouter()
  const [value, setValue] = useState(initialPlace ?? '')
  const [suggestions, setSuggestions] = useState([])
  const [pendingCoords, setPendingCoords] = useState(null)
  const [isDirty, setIsDirty] = useState(false)
  const [locating, setLocating] = useState(false)
  const [gpsError, setGpsError] = useState(null)
  const debounceRef = useRef(null)
  const wrapperRef = useRef(null)

  // Close suggestions when clicking outside.
  useEffect(() => {
    const handler = e => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setSuggestions([])
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const handleChange = e => {
    const v = e.target.value
    setValue(v)
    setIsDirty(true)
    setPendingCoords(null)

    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(async () => {
      setSuggestions(await nominatimSearch(v))
    }, 300)
  }

  const selectSuggestion = s => {
    setValue(s.display_name)
    setSuggestions([])
    setPendingCoords({ lat: parseFloat(s.lat), lon: parseFloat(s.lon) })
    setIsDirty(true)
  }

  const handleSet = async () => {
    let coords = pendingCoords
    if (!coords) {
      const results = await nominatimSearch(value)
      if (!results.length) return
      coords = { lat: parseFloat(results[0].lat), lon: parseFloat(results[0].lon) }
    }
    setLocationCookie(coords.lat, coords.lon)
    setIsDirty(false)
    setPendingCoords(null)
    router.refresh()
  }

  const handleGps = () => {
    if (!('geolocation' in navigator)) {
      setGpsError('Geolocation not supported.')
      return
    }
    setLocating(true)
    setGpsError(null)
    navigator.geolocation.getCurrentPosition(
      pos => {
        setLocationCookie(pos.coords.latitude, pos.coords.longitude)
        setLocating(false)
        router.refresh()
      },
      err => {
        setGpsError(err.message)
        setLocating(false)
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  return (
    <span className="location-input-row">
      <span className="location-input-wrapper" ref={wrapperRef}>
        <input
          type="text"
          className="location-input"
          value={value}
          onChange={handleChange}
          placeholder="City, state, or address…"
          aria-label="Location"
          aria-autocomplete="list"
        />
        {suggestions.length > 0 && (
          <ul className="location-suggestions" role="listbox">
            {suggestions.map((s, i) => (
              <li
                key={i}
                role="option"
                aria-selected={false}
                onMouseDown={() => selectSuggestion(s)}
              >
                {s.display_name}
              </li>
            ))}
          </ul>
        )}
      </span>
      <button
        type="button"
        className="location-set-button"
        onClick={handleSet}
        disabled={!isDirty}
      >
        Set
      </button>
      <button
        type="button"
        className="location-gps-button"
        onClick={handleGps}
        disabled={locating}
        title={locating ? 'Locating…' : 'Use my device location'}
      >
        <GpsIcon spinning={locating} />
      </button>
      {gpsError && (
        <span className="location-gps-error">{gpsError}</span>
      )}
    </span>
  )
}
