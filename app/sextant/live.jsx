'use client'

import { useEffect, useRef, useState } from 'react'
import { Table } from 'nextra/components'

const PHI = (1 + Math.sqrt(5)) / 2
const REFRESH_MS = (PHI / 5) * 1000
const RAD_TO_DEG = 180 / Math.PI

function fmt(n, digits = 3) {
  if (n === null || n === undefined || Number.isNaN(n)) return '—'
  return n.toFixed(digits)
}

function tiltTransform(x, y, z) {
  if (x === null || y === null || z === null) return 'none'
  const pitch = Math.atan2(y, z) * RAD_TO_DEG
  const roll = Math.atan2(-x, Math.sqrt(y * y + z * z)) * RAD_TO_DEG
  return `rotateX(${pitch}deg) rotateY(${roll}deg)`
}

export function LiveSextant() {
  const [reading, setReading] = useState({ x: null, y: null, z: null })
  const [permission, setPermission] = useState('unknown')
  const [supported, setSupported] = useState(true)
  const latestRef = useRef({ x: null, y: null, z: null })
  const squareRef = useRef(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    if (!('DeviceMotionEvent' in window)) {
      setSupported(false)
      return
    }

    const onMotion = (event) => {
      const g = event.accelerationIncludingGravity
      if (!g) return
      latestRef.current = { x: g.x, y: g.y, z: g.z }
    }

    let rafId = 0
    const animate = () => {
      const { x, y, z } = latestRef.current
      if (squareRef.current && x !== null) {
        squareRef.current.style.transform = tiltTransform(x, y, z)
      }
      rafId = requestAnimationFrame(animate)
    }

    const tick = setInterval(() => {
      setReading(latestRef.current)
    }, REFRESH_MS)

    const NeedsPermission =
      typeof DeviceMotionEvent !== 'undefined' &&
      typeof DeviceMotionEvent.requestPermission === 'function'

    if (NeedsPermission) {
      setPermission('needed')
    } else {
      setPermission('granted')
      window.addEventListener('devicemotion', onMotion)
      rafId = requestAnimationFrame(animate)
    }

    return () => {
      clearInterval(tick)
      cancelAnimationFrame(rafId)
      window.removeEventListener('devicemotion', onMotion)
    }
  }, [])

  const requestPermission = async () => {
    try {
      const result = await DeviceMotionEvent.requestPermission()
      setPermission(result)
      if (result === 'granted') {
        const onMotion = (event) => {
          const g = event.accelerationIncludingGravity
          if (!g) return
          latestRef.current = { x: g.x, y: g.y, z: g.z }
        }
        window.addEventListener('devicemotion', onMotion)
        const animate = () => {
          const { x, y, z } = latestRef.current
          if (squareRef.current && x !== null) {
            squareRef.current.style.transform = tiltTransform(x, y, z)
          }
          requestAnimationFrame(animate)
        }
        requestAnimationFrame(animate)
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
      {permission === 'denied' && <p>Accelerometer access was denied.</p>}
      <div
        style={{
          perspective: '600px',
          height: '240px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '1rem 0',
        }}
      >
        <div
          ref={squareRef}
          style={{
            width: '160px',
            height: '160px',
            background:
              'linear-gradient(135deg, rgba(99,102,241,0.6), rgba(236,72,153,0.6))',
            border: '2px solid currentColor',
            borderRadius: '8px',
            transformStyle: 'preserve-3d',
            transition: 'transform 60ms linear',
          }}
        />
      </div>
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
