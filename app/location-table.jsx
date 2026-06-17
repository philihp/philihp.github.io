import { Table } from 'nextra/components'
import { LiveClock } from './sun/live'
import { fmt } from './sun/solar'
import GpsButton from './location-input'

export default function LocationTable({ loc, showClock = true }) {
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
          </>
        )}
        <Table.Tr>
          <Table.Th>Latitude (browser)</Table.Th>
          <Table.Td>
            {deviceLat !== null ? `${fmt(deviceLat, 4)}°` : <em>not shared</em>}
          </Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>Longitude (browser)</Table.Th>
          <Table.Td>
            {deviceLon !== null ? `${fmt(deviceLon, 4)}°` : <em>not shared</em>}
          </Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>Location</Table.Th>
          <Table.Td>
            {devicePlace ?? place ?? <em>unknown</em>}
          </Table.Td>
        </Table.Tr>
        <Table.Tr>
          <Table.Th>Device location</Table.Th>
          <Table.Td>
            <GpsButton />
          </Table.Td>
        </Table.Tr>
        {showClock && (
          <Table.Tr>
            <Table.Th>Time (UTC)</Table.Th>
            <Table.Td>
              <LiveClock />
            </Table.Td>
          </Table.Tr>
        )}
      </tbody>
    </Table>
  )
}
