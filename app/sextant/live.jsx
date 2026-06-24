'use client'

import { useEffect, useState } from 'react'
import { Table } from 'nextra/components'

const PHI = (1 + Math.sqrt(5)) / 2
const REFRESH_MS = (PHI / 5) * 1000

function fmt(n, digits = 3) {
  if (n === null || n === undefined || Number.isNaN(n)) return '—'
  return n.toFixed(digits)
}

export function LiveSextant() {
  const [reading, setReading] = useState({ x: null, y: null, z: null })
  const [permission, setPermission] = useState('unknown')
  const [supported, setSupported] = useState(true)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('DeviceMotionEvent' in window)) {
      setSupported(false)
      return
    }

    let latest = { x: null, y: null, z: null }
    const onMotion = (event) => {
      const g = event.accelerationIncludingGravity
      if (!g) return
      latest = { x: g.x, y: g.y, z: g.z }
    }

    const tick = setInterval(() => {
      setReading(latest)
    }, REFRESH_MS)

    const attach = () => window.addEventListener('devicemotion', onMotion)

    const NeedsPermission =
      typeof DeviceMotionEvent !== 'undefined' &&
      typeof DeviceMotionEvent.requestPermission === 'function'

    if (NeedsPermission) {
      setPermission('needed')
    } else {
      setPermission('granted')
      attach()
    }

    return () => {
      clearInterval(tick)
      window.removeEventListener('devicemotion', onMotion)
    }
  }, [])

  const requestPermission = async () => {
    try {
      const result = await DeviceMotionEvent.requestPermission()
      setPermission(result)
      if (result === 'granted') {
        window.addEventListener('devicemotion', (event) => {
          const g = event.accelerationIncludingGravity
          if (!g) return
          setReading({ x: g.x, y: g.y, z: g.z })
        })
      }
    } catch (err) {
      setPermission('denied')
    }
  }

  if (!supported) {
    return <p>Your browser does not expose accelerometer data.</p>
  }

  const { x, y, z } = reading
  const magnitude =
    x === null || y === null || z === null
      ? null
      : Math.sqrt(x * x + y * y + z * z)

  return (
    <>
      {permission === 'needed' && (
        <p>
          <button onClick={requestPermission}>Enable accelerometer</button>
        </p>
      )}
      {permission === 'denied' && (
        <p>Accelerometer access was denied.</p>
      )}
      <Table>
        <tbody>
          <Table.Tr>
            <Table.Th>x (m/s²)</Table.Th>
            <Table.Td>{fmt(x)}</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Th>y (m/s²)</Table.Th>
            <Table.Td>{fmt(y)}</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Th>z (m/s²)</Table.Th>
            <Table.Td>{fmt(z)}</Table.Td>
          </Table.Tr>
          <Table.Tr>
            <Table.Th>magnitude</Table.Th>
            <Table.Td>{fmt(magnitude)}</Table.Td>
          </Table.Tr>
        </tbody>
      </Table>
    </>
  )
}
