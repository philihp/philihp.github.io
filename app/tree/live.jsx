'use client'

import { useEffect, useRef, useState } from 'react'
import { compass } from '../sun/solar'

const RAD = Math.PI / 180

// Forward bearing (degrees, 0 = N, clockwise) from point 1 to point 2.
function bearingTo(lat1, lon1, lat2, lon2) {
  const dLon = (lon2 - lon1) * RAD
  const x = Math.cos(lat2 * RAD) * Math.sin(dLon)
  const y =
    Math.cos(lat1 * RAD) * Math.sin(lat2 * RAD) -
    Math.sin(lat1 * RAD) * Math.cos(lat2 * RAD) * Math.cos(dLon)
  return ((Math.atan2(x, y) / RAD) + 360) % 360
}

// Great-circle distance in metres between two coordinates.
function distanceTo(lat1, lon1, lat2, lon2) {
  const dLat = (lat2 - lat1) * RAD
  const dLon = (lon2 - lon1) * RAD
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * RAD) * Math.cos(lat2 * RAD) * Math.sin(dLon / 2) ** 2
  return 6371000 * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
}

// Format "Fraxinus uhdei :: Shamel Ash: Evergreen Ash" → "Shamel Ash: Evergreen Ash (Fraxinus uhdei)"
function formatSpecies(qspecies) {
  if (!qspecies) return 'Unknown species'
  const sep = qspecies.indexOf(' :: ')
  if (sep === -1) return qspecies
  const scientific = qspecies.slice(0, sep)
  const common = qspecies.slice(sep + 4)
  return `${common} (${scientific})`
}

async function fetchTreesNear(lat, lon) {
  const url =
    `https://data.sfgov.org/resource/tkzw-k3nq.json` +
    `?$where=within_circle(location,${lat},${lon},50)&$limit=200`
  const res = await fetch(url)
  if (!res.ok) return null
  return await res.json()
}

// Fetches a Wikipedia thumbnail for a tree species using its scientific name.
function TreeImage({ qspecies }) {
  const [src, setSrc] = useState(null)
  const [alt, setAlt] = useState('')

  useEffect(() => {
    if (!qspecies) return
    const sep = qspecies.indexOf(' :: ')
    const scientific = sep === -1 ? qspecies : qspecies.slice(0, sep)
    if (!scientific) return

    const title = scientific.trim().replace(/ /g, '_')
    fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`)
      .then(r => (r.ok ? r.json() : null))
      .then(data => {
        if (data?.type !== 'disambiguation' && data?.thumbnail?.source) {
          setSrc(data.thumbnail.source)
          setAlt(data.title ?? scientific)
        }
      })
      .catch(() => {})
  }, [qspecies])

  if (!src) return null
  return <img src={src} alt={alt} className="tree-tile-image" />
}

export function LiveTrees({ lat: initialLat, lon: initialLon, trees: initialTrees, usingDeviceLocation }) {
  const [lat, setLat] = useState(initialLat)
  const [lon, setLon] = useState(initialLon)
  const [trees, setTrees] = useState(initialTrees)

  // Refs hold the latest averaged position for use inside interval callbacks
  // without stale-closure issues.
  const latRef = useRef(initialLat)
  const lonRef = useRef(initialLon)
  const lastTreeFetchRef = useRef(0) // epoch ms of last DB query

  useEffect(() => {
    if (!usingDeviceLocation || typeof navigator === 'undefined' || !navigator.geolocation) return

    const tick = () => {
      navigator.geolocation.getCurrentPosition(
        async pos => {
          const raw = pos.coords

          // Average with the previous smoothed position if one exists.
          const avgLat = latRef.current !== null
            ? (latRef.current + raw.latitude) / 2
            : raw.latitude
          const avgLon = lonRef.current !== null
            ? (lonRef.current + raw.longitude) / 2
            : raw.longitude

          latRef.current = avgLat
          lonRef.current = avgLon
          setLat(avgLat)
          setLon(avgLon)

          // Re-query the tree database at most once every 10 s.
          const now = Date.now()
          if (now - lastTreeFetchRef.current >= 10000) {
            lastTreeFetchRef.current = now
            const fresh = await fetchTreesNear(avgLat, avgLon)
            if (fresh !== null) setTrees(fresh)
          }
        },
        null,
        { enableHighAccuracy: true, timeout: 5000 }
      )
    }

    // Fire immediately on mount, then every 2 s.
    tick()
    const id = setInterval(tick, 2000)
    return () => clearInterval(id)
  }, [usingDeviceLocation])

  if (lat === null || lon === null) {
    return (
      <p>
        No location available. Share your device location below to see nearby
        trees.
      </p>
    )
  }

  if (!trees || trees.length === 0) {
    return (
      <p>
        No trees found within 50 m of this location. The dataset covers San
        Francisco street trees only.
      </p>
    )
  }

  const sorted = trees
    .filter(t => t.latitude && t.longitude)
    .map(t => {
      const tlat = parseFloat(t.latitude)
      const tlon = parseFloat(t.longitude)
      const b = bearingTo(lat, lon, tlat, tlon)
      const d = distanceTo(lat, lon, tlat, tlon)
      return { ...t, _bearing: b, _distance: d }
    })
    .sort((a, b) => a._distance - b._distance)
    .slice(0, 20)

  return (
    <>
      <p>
        {sorted.length} tree{sorted.length !== 1 ? 's' : ''} found, sorted by
        distance.
      </p>
      <div className="tree-grid">
        {sorted.map(t => (
          <div key={t.treeid} className="tree-tile">
            <div className="tree-tile-header">
              <div className="tree-tile-direction">
                {compass(t._bearing)} &middot; {t._bearing.toFixed(1)}°
              </div>
              <div className="tree-tile-distance">
                {Math.round(t._distance)} m away
              </div>
              <div className="tree-tile-species">
                {formatSpecies(t.qspecies)}
              </div>
            </div>
            <TreeImage qspecies={t.qspecies} />
            <div className="tree-tile-body">
              <dl className="tree-tile-details">
                {t.qaddress && (
                  <>
                    <dt>Address</dt>
                    <dd>{t.qaddress}</dd>
                  </>
                )}
                {t.qlegalstatus && (
                  <>
                    <dt>Status</dt>
                    <dd>{t.qlegalstatus}</dd>
                  </>
                )}
                {t.qcaretaker && (
                  <>
                    <dt>Caretaker</dt>
                    <dd>{t.qcaretaker}</dd>
                  </>
                )}
                {t.qsiteinfo && (
                  <>
                    <dt>Site</dt>
                    <dd>{t.qsiteinfo}</dd>
                  </>
                )}
                {t.dbh && (
                  <>
                    <dt>Trunk ⌀</dt>
                    <dd>{t.dbh}" at breast height</dd>
                  </>
                )}
                {t.plantdate && (
                  <>
                    <dt>Planted</dt>
                    <dd>{t.plantdate.slice(0, 10)}</dd>
                  </>
                )}
              </dl>
            </div>
          </div>
        ))}
      </div>
    </>
  )
}
