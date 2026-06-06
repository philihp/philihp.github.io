'use client'

import { useEffect, useRef, useState } from 'react'

const NS = 'http://www.w3.org/2000/svg'
const palette = [
  '#fde8e8',
  '#e8f5fd',
  '#eafde8',
  '#fdf5e8',
  '#f5e8fd',
  '#e8fdf5',
  '#fdeae8',
  '#e8eafd',
  '#fdfde8',
  '#e8fdfd'
]

// --- vendored pointille algorithm (matches the npm package) ------------------
function regularPolygon(n) {
  const pts = []
  for (let i = 0; i < n; i++) {
    const a = -Math.PI / 2 + (i * 2 * Math.PI) / n
    pts.push([Math.cos(a), Math.sin(a)])
  }
  return pts
}

function clipHalfPlane(poly, a, b) {
  const dx = b[0] - a[0],
    dy = b[1] - a[1]
  const mx = (a[0] + b[0]) / 2,
    my = (a[1] + b[1]) / 2
  const f = p => (p[0] - mx) * dx + (p[1] - my) * dy
  const out = []
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i]
    const q = poly[(i + 1) % poly.length]
    const fp = f(p),
      fq = f(q)
    if (fp <= 0) {
      out.push(p)
      if (fq > 0) {
        const t = fp / (fp - fq)
        out.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])])
      }
    } else if (fq <= 0) {
      const t = fp / (fp - fq)
      out.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])])
    }
  }
  return out
}

function voronoiCells(points, polygon) {
  return points.map((p, i) => {
    let cell = polygon
    for (let j = 0; j < points.length; j++) {
      if (i === j) continue
      cell = clipHalfPlane(cell, p, points[j])
      if (cell.length === 0) break
    }
    return cell
  })
}

function halton(i, base) {
  let f = 1,
    r = 0
  while (i > 0) {
    f /= base
    r += f * (i % base)
    i = Math.floor(i / base)
  }
  return r
}

function pointInPolygon(p, polygon) {
  let inside = false
  const px = p[0],
    py = p[1]
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const xi = polygon[i][0],
      yi = polygon[i][1]
    const xj = polygon[j][0],
      yj = polygon[j][1]
    if (
      yi > py !== yj > py &&
      px < ((xj - xi) * (py - yi)) / (yj - yi) + xi
    ) {
      inside = !inside
    }
  }
  return inside
}

function polygonCentroid(poly) {
  let cx = 0,
    cy = 0,
    A = 0
  for (let i = 0; i < poly.length; i++) {
    const [x0, y0] = poly[i]
    const [x1, y1] = poly[(i + 1) % poly.length]
    const cross = x0 * y1 - x1 * y0
    A += cross
    cx += (x0 + x1) * cross
    cy += (y0 + y1) * cross
  }
  A *= 0.5
  if (Math.abs(A) < 1e-12) {
    let sx = 0,
      sy = 0
    for (const [x, y] of poly) {
      sx += x
      sy += y
    }
    return [sx / poly.length, sy / poly.length]
  }
  return [cx / (6 * A), cy / (6 * A)]
}

function pointille(polygon, n, { iterations = 30, seed = 1 } = {}) {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity
  for (const [x, y] of polygon) {
    if (x < minX) minX = x
    if (y < minY) minY = y
    if (x > maxX) maxX = x
    if (y > maxY) maxY = y
  }
  const W = maxX - minX,
    H = maxY - minY
  const points = []
  let i = seed
  while (points.length < n && i < seed + 100000) {
    const p = [minX + halton(i, 2) * W, minY + halton(i, 3) * H]
    if (pointInPolygon(p, polygon)) points.push(p)
    i++
  }
  for (let it = 0; it < iterations; it++) {
    const cells = voronoiCells(points, polygon)
    for (let k = 0; k < points.length; k++) {
      if (cells[k].length < 3) continue
      const c = polygonCentroid(cells[k])
      if (pointInPolygon(c, polygon)) points[k] = c
    }
  }
  return points
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
}

function resamplePolygon(polygon, K) {
  const N = polygon.length
  const lens = new Array(N)
  let total = 0
  for (let i = 0; i < N; i++) {
    const a = polygon[i],
      b = polygon[(i + 1) % N]
    const dx = b[0] - a[0],
      dy = b[1] - a[1]
    lens[i] = Math.sqrt(dx * dx + dy * dy)
    total += lens[i]
  }
  const out = new Array(K)
  for (let k = 0; k < K; k++) {
    let target = (k * total) / K
    let i = 0
    while (i < N - 1 && target > lens[i]) {
      target -= lens[i]
      i++
    }
    const t = target / lens[i]
    const a = polygon[i],
      b = polygon[(i + 1) % N]
    out[k] = [a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])]
  }
  return out
}

function pairPoints(from, to) {
  const M = from.length,
    N = to.length
  const ptFrom = new Array(N)
  if (M === 0) {
    for (let j = 0; j < N; j++) ptFrom[j] = [to[j][0], to[j][1]]
    return ptFrom
  }
  const pairs = []
  for (let i = 0; i < M; i++) {
    for (let j = 0; j < N; j++) {
      const dx = from[i][0] - to[j][0]
      const dy = from[i][1] - to[j][1]
      pairs.push([dx * dx + dy * dy, i, j])
    }
  }
  pairs.sort((a, b) => a[0] - b[0])
  const usedF = new Uint8Array(M),
    usedT = new Uint8Array(N)
  let filled = 0
  for (let p = 0; p < pairs.length && filled < N; p++) {
    const [, i, j] = pairs[p]
    if (usedF[i] || usedT[j]) continue
    ptFrom[j] = [from[i][0], from[i][1]]
    usedF[i] = 1
    usedT[j] = 1
    filled++
  }
  for (let j = 0; j < N; j++) {
    if (!ptFrom[j]) ptFrom[j] = [to[j][0], to[j][1]]
  }
  return ptFrom
}

function el(name, attrs) {
  const e = document.createElementNS(NS, name)
  for (const k in attrs) e.setAttribute(k, attrs[k])
  return e
}

// --- a single static figure: a polygon with its evenly distributed points ----
export function PointilleFigure({ polygon, n }) {
  const ref = useRef(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return
    const points = pointille(polygon, n)
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity
    for (const [x, y] of polygon) {
      if (x < minX) minX = x
      if (y < minY) minY = y
      if (x > maxX) maxX = x
      if (y > maxY) maxY = y
    }
    const w = maxX - minX,
      h = maxY - minY
    const span = Math.max(w, h)
    const pad = span * 0.08
    const svgEl = document.createElementNS(NS, 'svg')
    svgEl.setAttribute(
      'viewBox',
      `${minX - pad} ${-maxY - pad} ${w + 2 * pad} ${h + 2 * pad}`
    )
    svgEl.setAttribute('preserveAspectRatio', 'xMidYMid meet')
    svgEl.setAttribute('style', `aspect-ratio: ${w + 2 * pad} / ${h + 2 * pad}`)
    const g = el('g', { transform: 'scale(1,-1)' })
    svgEl.appendChild(g)
    g.appendChild(
      el('polygon', {
        points: polygon.map(p => p.join(',')).join(' '),
        fill: 'none',
        stroke: '#333',
        'stroke-width': span * 0.008,
        'stroke-linejoin': 'round'
      })
    )
    const r = span * 0.018
    points.forEach(p => {
      g.appendChild(el('circle', { cx: p[0], cy: p[1], r, fill: '#222' }))
    })
    container.innerHTML = ''
    container.appendChild(svgEl)
  }, [polygon, n])

  return (
    <div
      ref={ref}
      className="pointille-figure"
      style={{ maxWidth: 320, margin: '1.25em auto' }}
    />
  )
}

// --- the 13-sided rondel with emoji tokens -----------------------------------
export function PointilleRondel() {
  const ref = useRef(null)

  useEffect(() => {
    const rondel = ref.current
    if (!rondel) return
    rondel.innerHTML = ''

    const R = 200
    const SIDES = 13
    const vertices = []
    for (let i = 0; i < SIDES; i++) {
      const a = -Math.PI / 2 - (i * 2 * Math.PI) / SIDES
      vertices.push([R * Math.cos(a), R * Math.sin(a)])
    }

    const defs = el('defs', {})
    const filter = el('filter', { id: 'rondel-shadow' })
    filter.appendChild(
      el('feGaussianBlur', { in: 'SourceGraphic', stdDeviation: '4' })
    )
    defs.appendChild(filter)
    rondel.appendChild(defs)

    const outline =
      vertices.map(v => v.join(',')).join(' ') + ' ' + vertices[0].join(',')
    const shadowG = el('g', { opacity: '0.2' })
    shadowG.appendChild(
      el('polyline', {
        points: outline,
        fill: 'black',
        filter: 'url(#rondel-shadow)'
      })
    )
    rondel.appendChild(shadowG)

    const wheel = el('g', {})
    for (let i = 0; i < SIDES; i++) {
      const a = vertices[i],
        b = vertices[(i + 1) % SIDES]
      wheel.appendChild(
        el('polyline', {
          points: `0,0 ${a[0]},${a[1]} ${b[0]},${b[1]} 0,0`,
          fill: '#fcfcfc',
          stroke: '#b3b3b3',
          'stroke-width': '1'
        })
      )
    }
    rondel.appendChild(wheel)

    const wedges = {
      0: ['🌾', '🐑', '🪙'],
      1: ['🪵', '🧱'],
      2: ['🃏', '💩']
    }

    const tokenLayer = el('g', {})
    for (const key in wedges) {
      const i = +key
      const emojis = wedges[key]
      const wedgePolygon = [[0, 0], vertices[i], vertices[(i + 1) % SIDES]]
      const positions = pointille(wedgePolygon, emojis.length, {
        iterations: 60
      })
      emojis.forEach((emoji, j) => {
        const t = el('text', {
          x: positions[j][0],
          y: positions[j][1],
          'text-anchor': 'middle',
          'dominant-baseline': 'central',
          'font-size': '28'
        })
        t.textContent = emoji
        tokenLayer.appendChild(t)
      })
    }
    rondel.appendChild(tokenLayer)
  }, [])

  return (
    <svg
      ref={ref}
      style={{ float: 'right', width: 450, height: 450, maxWidth: '100%' }}
      viewBox="-210.5 -210.5 420 420"
      aria-label="A 13-sided rondel with emoji tokens placed in three of its wedges"
    />
  )
}

// --- the interactive demo with sliders ---------------------------------------
export function PointilleDemo() {
  const svgRef = useRef(null)
  const stateRef = useRef(null)
  const [sides, setSides] = useState(5)
  const [points, setPoints] = useState(25)

  function render(polygon, pts) {
    const svg = svgRef.current
    if (!svg) return
    const cells = voronoiCells(pts, polygon)
    while (svg.firstChild) svg.removeChild(svg.firstChild)
    const g = el('g', { transform: 'scale(1,-1)' })
    svg.appendChild(g)

    cells.forEach((cell, i) => {
      if (cell.length < 3) return
      g.appendChild(
        el('polygon', {
          points: cell.map(p => p.join(',')).join(' '),
          fill: palette[i % palette.length],
          stroke: '#bbb',
          'stroke-width': '0.006',
          'stroke-linejoin': 'round'
        })
      )
    })

    g.appendChild(
      el('polygon', {
        points: polygon.map(p => p.join(',')).join(' '),
        fill: 'none',
        stroke: '#333',
        'stroke-width': '0.012',
        'stroke-linejoin': 'round'
      })
    )

    const k = pts.length
    const r = Math.max(0.005, Math.min(0.04, 0.05 / Math.sqrt(k)))
    pts.forEach(p => {
      g.appendChild(el('circle', { cx: p[0], cy: p[1], r, fill: '#222' }))
    })
  }

  useEffect(() => {
    const initialPolygon = regularPolygon(sides)
    stateRef.current = {
      displayPolygon: initialPolygon,
      displayPoints: pointille(initialPolygon, points),
      anim: null,
      rafId: 0
    }
    render(stateRef.current.displayPolygon, stateRef.current.displayPoints)
    return () => {
      if (stateRef.current?.rafId) cancelAnimationFrame(stateRef.current.rafId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function tick(now) {
    const state = stateRef.current
    state.rafId = 0
    const a = state.anim
    if (!a) return
    const t = Math.min(1, (now - a.start) / a.dur)
    if (t >= 1) {
      state.displayPolygon = a.targetPolygon
      state.displayPoints = a.ptTo
      state.anim = null
      render(a.targetPolygon, a.ptTo)
      return
    }
    const tt = easeInOut(t)
    const poly = a.polyFrom.map((p, i) => [
      p[0] + (a.polyTo[i][0] - p[0]) * tt,
      p[1] + (a.polyTo[i][1] - p[1]) * tt
    ])
    const pts = a.ptFrom.map((p, i) => [
      p[0] + (a.ptTo[i][0] - p[0]) * tt,
      p[1] + (a.ptTo[i][1] - p[1]) * tt
    ])
    state.displayPolygon = poly
    state.displayPoints = pts
    render(poly, pts)
    state.rafId = requestAnimationFrame(tick)
  }

  function startTransition(n, k) {
    const state = stateRef.current
    if (!state) return
    const targetPolygon = regularPolygon(n)
    const targetPoints = pointille(targetPolygon, k)
    const K = Math.max(state.displayPolygon.length, targetPolygon.length)
    const polyFrom = resamplePolygon(state.displayPolygon, K)
    const polyTo = resamplePolygon(targetPolygon, K)
    const ptFrom = pairPoints(state.displayPoints, targetPoints)
    state.anim = {
      start: performance.now(),
      dur: 350,
      polyFrom,
      polyTo,
      ptFrom,
      ptTo: targetPoints,
      targetPolygon
    }
    if (!state.rafId) state.rafId = requestAnimationFrame(tick)
  }

  const onSides = e => {
    const n = +e.target.value
    setSides(n)
    startTransition(n, points)
  }
  const onPoints = e => {
    const k = +e.target.value
    setPoints(k)
    startTransition(sides, k)
  }

  return (
    <div id="pointille-demo" style={{ maxWidth: 520, margin: '2em auto' }}>
      <svg
        ref={svgRef}
        viewBox="-1.15 -1.15 2.3 2.3"
        preserveAspectRatio="xMidYMid meet"
        aria-label="Pointille interactive demo"
        style={{
          width: '100%',
          aspectRatio: '1 / 1',
          background: '#fafafa',
          border: '1px solid #eee',
          display: 'block'
        }}
      />
      <div
        className="controls"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '.5em',
          marginTop: '1em',
          fontFamily: 'monospace'
        }}
      >
        <label style={{ display: 'flex', alignItems: 'center', gap: '.75em' }}>
          <span style={{ width: '4em' }}>Sides</span>
          <input
            type="range"
            min="3"
            max="7"
            step="1"
            value={sides}
            onChange={onSides}
            style={{ flex: 1 }}
          />
          <span style={{ width: '2.5em', textAlign: 'right' }}>{sides}</span>
        </label>
        <label style={{ display: 'flex', alignItems: 'center', gap: '.75em' }}>
          <span style={{ width: '4em' }}>Points</span>
          <input
            type="range"
            min="1"
            max="100"
            step="1"
            value={points}
            onChange={onPoints}
            style={{ flex: 1 }}
          />
          <span style={{ width: '2.5em', textAlign: 'right' }}>{points}</span>
        </label>
      </div>
    </div>
  )
}
