'use client'

import { Table } from 'nextra/components'
import { useNow } from '../sun/live'
import { compass, fmt } from '../sun/solar'
import { moonPosition } from './moon'

export function LiveMoon({ lat, lon }) {
  const now = useNow()

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

  const moon = moonPosition(now, lat, lon)
  return (
    <Table>
      <tbody>
        <Table.Tr>
          <Table.Th>Phase</Table.Th>
          <Table.Td>
            {moon.phase} ({fmt(moon.illumination, 1)}% illuminated)
          </Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>Azimuth (angle in the sky)</Table.Th>
          <Table.Td>
            {fmt(moon.azimuth)}° ({compass(moon.azimuth)})
          </Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>Elevation / inclination above horizon</Table.Th>
          <Table.Td>
            {fmt(moon.elevation)}°{' '}
            {moon.elevation < 0 && <em>(below the horizon)</em>}
          </Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>Distance</Table.Th>
          <Table.Td>{fmt(moon.distanceKm, 0)} km</Table.Td>
        </Table.Tr>
      </tbody>
    </Table>
  )
}
