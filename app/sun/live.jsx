'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { Table } from 'nextra/components'
import { solarPosition, fmt, compass } from './solar'

// A single ticking clock shared by every live piece on the page, so the
// displayed time and the sun position are always computed from the same
// instant. Seeded with the server's render time so the first client render
// matches the SSR output (no hydration mismatch), then updated every half-phi
// (the golden ratio conjugate, ~0.618) seconds — i.e. ~0.309 s.
const NowContext = createContext(new Date(0))

// The golden ratio conjugate, (sqrt(5) - 1) / 2 ≈ 0.6180339887.
const PHI = (Math.sqrt(5) - 1) / 2
// Refresh twice as fast as phi seconds, i.e. half the interval (~309 ms).
const REFRESH_MS = (PHI * 1000) / 2

export function LiveTimeProvider({ initialISO, children }) {
  const [now, setNow] = useState(() => new Date(initialISO))
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), REFRESH_MS)
    return () => clearInterval(id)
  }, [])
  return <NowContext.Provider value={now}>{children}</NowContext.Provider>
}

// The shared ticking clock, for live components on other pages (e.g. /moon).
export function useNow() {
  return useContext(NowContext)
}

export function LiveClock() {
  const now = useContext(NowContext)
  return <>{now.toISOString()}</>
}

export function LiveSun({ lat, lon }) {
  const now = useContext(NowContext)

  if (lat === null || lon === null) {
    return (
      <p>
        No location available. On Vercel this comes from the{' '}
        <code>x-vercel-ip-latitude</code> / <code>x-vercel-ip-longitude</code>{' '}
        headers; locally, set the <code>LATITUDE</code> and{' '}
        <code>LONGITUDE</code> environment variables.
      </p>
    )
  }

  const sun = solarPosition(now, lat, lon)
  return (
    <Table>
      <tbody>
        <Table.Tr>
          <Table.Th>Declination</Table.Th>
          <Table.Td>{fmt(sun.declination)}°</Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>Azimuth (angle in the sky)</Table.Th>
          <Table.Td>
            {fmt(sun.azimuth)}° ({compass(sun.azimuth)})
          </Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>Elevation / inclination above horizon</Table.Th>
          <Table.Td>
            {fmt(sun.elevation)}°{' '}
            {sun.elevation < 0 && <em>(below the horizon)</em>}
          </Table.Td>
        </Table.Tr>
      </tbody>
    </Table>
  )
}
