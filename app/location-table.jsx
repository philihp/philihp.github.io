import { Table } from 'nextra/components'
import { LiveClock } from './sun/live'
import { fmt } from './sun/solar'

// The "Location & Time" table shared by the /sun and /moon pages. Shows the
// Vercel IP estimate until the visitor shares their device location, which is
// more accurate and replaces it.
export default function LocationTable({ loc }) {
  const { lat, lon, place, deviceLat, deviceLon, devicePlace } = loc
  return (
    <Table>
      <tbody>
        {!loc.usingDeviceLocation && (
          <>
            <Table.Tr>
              <Table.Th>Latitude</Table.Th>
              <Table.Td>
                {lat !== null ? `${fmt(lat, 4)}°` : <em>unavailable</em>}
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th>Longitude</Table.Th>
              <Table.Td>
                {lon !== null ? `${fmt(lon, 4)}°` : <em>unavailable</em>}
              </Table.Td>
            </Table.Tr>
            <Table.Tr>
              <Table.Th>Nearest city / state / country</Table.Th>
              <Table.Td>{place !== '' ? place : <em>unavailable</em>}</Table.Td>
            </Table.Tr>
          </>
        )}
        <Table.Tr>
          <Table.Th>Device latitude (browser)</Table.Th>
          <Table.Td>
            {deviceLat !== null ? `${fmt(deviceLat, 4)}°` : <em>not shared</em>}
          </Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>Device longitude (browser)</Table.Th>
          <Table.Td>
            {deviceLon !== null ? `${fmt(deviceLon, 4)}°` : <em>not shared</em>}
          </Table.Td>
        </Table.Tr>
        {loc.usingDeviceLocation && (
          <Table.Tr>
            <Table.Th>Device city (reverse lookup)</Table.Th>
            <Table.Td>{devicePlace ?? <em>unavailable</em>}</Table.Td>
          </Table.Tr>
        )}
        <Table.Tr>
          <Table.Th>Time (UTC)</Table.Th>
          <Table.Td>
            <LiveClock />
          </Table.Td>
        </Table.Tr>
      </tbody>
    </Table>
  )
}
