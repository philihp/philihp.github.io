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

function boundingBox(polygon) {
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
  return [minX, minY, maxX, maxY]
}

function signedArea(polygon) {
  let a = 0
  for (let i = 0; i < polygon.length; i++) {
    const [x0, y0] = polygon[i]
    const [x1, y1] = polygon[(i + 1) % polygon.length]
    a += x0 * y1 - x1 * y0
  }
  return a / 2
}

function seedPoints(polygon, n, seed, accept) {
  const [minX, minY, maxX, maxY] = boundingBox(polygon)
  const W = maxX - minX,
    H = maxY - minY
  const out = []
  const budget = Math.max(1000, n * 2000)
  for (let k = 0; k < budget && out.length < n; k++) {
    const p = [minX + halton(seed + k, 2) * W, minY + halton(seed + k, 3) * H]
    if (accept(p)) out.push(p)
  }
  return out
}

function lloydRelax(polygon, iterations, clamp) {
  return input => {
    const points = input.map(p => [p[0], p[1]])
    for (let it = 0; it < iterations; it++) {
      const cells = voronoiCells(points, polygon)
      for (let k = 0; k < points.length; k++) {
        if (cells[k].length < 3) continue
        const c = polygonCentroid(cells[k])
        const q = clamp ? clamp(c) : c
        if (pointInPolygon(q, polygon)) points[k] = q
      }
    }
    return points
  }
}

// --- circle packing (the `radius` option) ------------------------------------
// Ported from the package's safe-region/separate modules. The guarantee is
// enforced by verifyPacking, an exact check — the iterative clamp and push
// steps below are only ever a way of reaching a layout that passes it.

class PointilleFitError extends Error {
  constructor(message) {
    super(message)
    this.name = 'PointilleFitError'
  }
}

function nearestOnSegment(p, a, b) {
  const abx = b[0] - a[0],
    aby = b[1] - a[1]
  const lenSq = abx * abx + aby * aby
  const t =
    lenSq === 0
      ? 0
      : Math.min(
          1,
          Math.max(0, ((p[0] - a[0]) * abx + (p[1] - a[1]) * aby) / lenSq)
        )
  return [a[0] + t * abx, a[1] + t * aby]
}

function nearestBoundaryPoint(polygon) {
  const n = polygon.length
  return p => {
    let best = { point: polygon[0], dist: Infinity, edge: 0 }
    for (let i = 0; i < n; i++) {
      const q = nearestOnSegment(p, polygon[i], polygon[(i + 1) % n])
      const d = Math.hypot(p[0] - q[0], p[1] - q[1])
      if (d < best.dist) best = { point: q, dist: d, edge: i }
    }
    return best
  }
}

function distanceToBoundary(polygon) {
  const nearest = nearestBoundaryPoint(polygon)
  return p => nearest(p).dist
}

// Clip a polygon to the half-plane on the normal's side of a line.
function clipByLine(poly, origin, normal) {
  const f = p => (p[0] - origin[0]) * normal[0] + (p[1] - origin[1]) * normal[1]
  const out = []
  for (let i = 0; i < poly.length; i++) {
    const p = poly[i],
      q = poly[(i + 1) % poly.length]
    const fp = f(p),
      fq = f(q)
    if (fp >= 0) {
      out.push(p)
      if (fq < 0) {
        const t = fp / (fp - fq)
        out.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])])
      }
    } else if (fq >= 0) {
      const t = fp / (fp - fq)
      out.push([p[0] + t * (q[0] - p[0]), p[1] + t * (q[1] - p[1])])
    }
  }
  return out
}

// The "safe region" for radius r: valid centers for a circle of radius r that
// must sit fully inside. Every edge is pushed inward by r and the half-planes
// intersected, which is exact for convex polygons — the rondel's wedges are
// triangles. The package solves the general case iteratively, since it also
// has to cope with concave shapes and their necks.
function safeRegion(polygon, r) {
  const orientation = signedArea(polygon) >= 0 ? 1 : -1
  // Overshoot a hair so the constraint still holds after rounding.
  const inset = r * (1 + 1e-9)
  let region = polygon.map(p => [p[0], p[1]])
  for (let i = 0; i < polygon.length; i++) {
    const a = polygon[i],
      b = polygon[(i + 1) % polygon.length]
    const dx = b[0] - a[0],
      dy = b[1] - a[1]
    const len = Math.hypot(dx, dy)
    if (len === 0) continue
    const normal = [(-dy / len) * orientation, (dx / len) * orientation]
    region = clipByLine(
      region,
      [a[0] + normal[0] * inset, a[1] + normal[1] * inset],
      normal
    )
    if (region.length < 3) return []
  }
  return region
}

// Projection onto a convex region is exact: keep interior points, and pull
// anything outside back to the nearest point of its boundary.
function clampToRegion(region) {
  const nearest = nearestBoundaryPoint(region)
  return p => (pointInPolygon(p, region) ? p : nearest(p).point)
}

// Exact O(n²) check of both constraints. This is what makes the guarantee
// hard rather than hopeful.
function verifyPacking(polygon, wallInset, pairDistance, points, epsilon) {
  const boundary = distanceToBoundary(polygon)
  let minPairwise = Infinity,
    minBoundary = Infinity
  for (let i = 0; i < points.length; i++) {
    const d = boundary(points[i])
    if (d < minBoundary) minBoundary = d
    for (let j = i + 1; j < points.length; j++) {
      const dd = Math.hypot(
        points[i][0] - points[j][0],
        points[i][1] - points[j][1]
      )
      if (dd < minPairwise) minPairwise = dd
    }
  }
  return {
    ok: minPairwise >= pairDistance - epsilon && minBoundary >= wallInset - epsilon,
    minPairwise,
    minBoundary
  }
}

const BETA = 0.7
const MAX_SEPARATION_STEPS = 256
const GOLDEN_ANGLE = 2.399963229728653

// Damped symmetric push-apart, applied all at once (Jacobi, so the result
// does not depend on iteration order) and clamped back into the safe region.
// The package walks the Delaunay graph to find close pairs; the counts here
// are small enough that every pair is cheaper than triangulating.
function separate(polygon, wallInset, pairDistance, clamp) {
  const [minX, minY, maxX, maxY] = boundingBox(polygon)
  const scale = Math.max(maxX - minX, maxY - minY, 1)
  const epsilon = 1e-9 * scale
  const delta = 1e-12 * scale

  return input => {
    let pts = input.map(clamp)
    for (let step = 0; step < MAX_SEPARATION_STEPS; step++) {
      if (verifyPacking(polygon, wallInset, pairDistance, pts, epsilon).ok) {
        return pts
      }
      if (pts.length < 2) break
      const dx = new Float64Array(pts.length)
      const dy = new Float64Array(pts.length)
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const d = Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1])
          if (d >= pairDistance) continue
          const push = (BETA * (pairDistance - d)) / 2
          let ux, uy
          if (d > delta) {
            ux = (pts[i][0] - pts[j][0]) / d
            uy = (pts[i][1] - pts[j][1]) / d
          } else {
            // Coincident points need a deterministic direction to split along.
            ux = Math.cos(i * GOLDEN_ANGLE)
            uy = Math.sin(i * GOLDEN_ANGLE)
          }
          dx[i] += push * ux
          dy[i] += push * uy
          dx[j] -= push * ux
          dy[j] -= push * uy
        }
      }
      pts = pts.map((p, i) =>
        dx[i] === 0 && dy[i] === 0 ? p : clamp([p[0] + dx[i], p[1] + dy[i]])
      )
    }
    throw new PointilleFitError(
      `could not arrange ${pts.length} circle centers at pairwise distance >= ${pairDistance}`
    )
  }
}

const BISECTION_STEPS = 14

function pointille(polygon, n, { iterations = 30, seed = 1, radius = 0 } = {}) {
  if (n <= 0 || polygon.length < 3) return []

  if (radius === 0) {
    const points = seedPoints(polygon, n, seed, p => pointInPolygon(p, polygon))
    if (points.length < n) return points
    return lloydRelax(polygon, iterations, null)(points)
  }

  const area = Math.abs(signedArea(polygon))
  if (n * Math.PI * radius * radius > area) {
    throw new PointilleFitError(
      `${n} circles of radius ${radius} cannot fit in area ${area.toFixed(3)}`
    )
  }

  const boundary = distanceToBoundary(polygon)

  // Solve for an effective radius R: centers >= 2R apart and >= 2R - r from
  // the boundary. R = r is exactly the base guarantee; anything larger buys
  // an equal surface gap of 2(R - r) both between circles and against the
  // wall, which is what stops them hugging the edges.
  const solve = (R, lloydIterations) => {
    const wallInset = 2 * R - radius
    const region = safeRegion(polygon, wallInset)
    if (region.length < 3) return null
    const clamp = clampToRegion(region)
    // Scan the region's own bounding box — in a thin wedge the polygon's box
    // is mostly outside it, and the scan would spend its budget missing.
    const seeds = seedPoints(region, n, seed, p => pointInPolygon(p, region))
    if (seeds.length < n) return null
    const relaxed = lloydRelax(polygon, lloydIterations, clamp)(seeds)
    try {
      return separate(polygon, wallInset, 2 * R, clamp)(relaxed)
    } catch (e) {
      if (e instanceof PointilleFitError) return null
      throw e
    }
  }

  const baseline = solve(radius, iterations)
  if (baseline === null) {
    throw new PointilleFitError(
      `could not arrange ${n} non-overlapping circles of radius ${radius}`
    )
  }

  // Bisect for the largest feasible R, bounded by area and by the deepest
  // interior point a deterministic scan can find.
  const [minX, minY, maxX, maxY] = boundingBox(polygon)
  let dmax = 0
  const budget = Math.max(1000, n * 2000)
  for (let k = 0; k < budget; k++) {
    const p = [
      minX + halton(seed + k, 2) * (maxX - minX),
      minY + halton(seed + k, 3) * (maxY - minY)
    ]
    if (pointInPolygon(p, polygon)) {
      const d = boundary(p)
      if (d > dmax) dmax = d
    }
  }
  const hi = Math.max(
    radius,
    Math.min(Math.sqrt(area / (n * Math.PI)), (dmax + radius) / 2)
  )

  const probeIterations = Math.min(iterations, 10)
  let lo = radius,
    hiBound = hi,
    bestR = radius,
    best = baseline
  for (let step = 0; step < BISECTION_STEPS; step++) {
    const mid = (lo + hiBound) / 2
    const attempt = solve(mid, probeIterations)
    if (attempt !== null) {
      lo = mid
      bestR = mid
      best = attempt
    } else {
      hiBound = mid
    }
  }

  if (bestR > radius) {
    const polished = solve(bestR, iterations)
    if (polished !== null) return polished
  }
  return best
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

// --- the same rondel, but every token is a circle of a size you pick ---------
const RONDEL_SIDES = 13
const RONDEL_R = 200
// One good per wedge, 3 through 9 of them, cycling around the wheel. All
// round-ish on purpose: a glyph that fills its em square (🧱, 🃏, ⛏️) paints
// outside the circle it was placed for, which makes the packing look wrong
// even when it isn't.
const RONDEL_TOKENS = [
  '🪙',
  '🍊',
  '🍅',
  '🫐',
  '🥚',
  '🍇',
  '🌰',
  '🍪',
  '🥔',
  '🧅',
  '🍒',
  '🍋',
  '🧄'
]
// Emoji ink measures about 1.25x the font-size, so this draws tokens roughly
// 28 units across — which is what makes r = 14 the honest description of one.
const RONDEL_TOKEN_INK = 28
const RONDEL_TOKEN_SIZE = RONDEL_TOKEN_INK / 1.25
const MAX_RADIUS = 18

const rondelVertices = () => {
  const out = []
  for (let i = 0; i < RONDEL_SIDES; i++) {
    const a = -Math.PI / 2 - (i * 2 * Math.PI) / RONDEL_SIDES
    out.push([RONDEL_R * Math.cos(a), RONDEL_R * Math.sin(a)])
  }
  return out
}

const wedgeCount = i => 3 + (i % 7)

// Every wedge is a rotation of the first one about the center, so a layout
// only has to be solved once per (count, radius) and then spun into place.
function canonicalLayout(cache, vertices, n, radius) {
  const key = `${n}:${radius}`
  if (!cache.has(key)) {
    const wedge = [[0, 0], vertices[0], vertices[1]]
    try {
      cache.set(key, pointille(wedge, n, { iterations: 30, radius }))
    } catch (e) {
      if (!(e instanceof PointilleFitError)) throw e
      cache.set(key, null) // n circles of this size will not fit
    }
  }
  return cache.get(key)
}

const rotate = (points, angle) => {
  const c = Math.cos(angle),
    s = Math.sin(angle)
  return points.map(([x, y]) => [x * c - y * s, x * s + y * c])
}

export function PointilleRondelRadius() {
  const ref = useRef(null)
  const cache = useRef(new Map())
  const [radius, setRadius] = useState(RONDEL_TOKEN_INK / 2)
  const [crowded, setCrowded] = useState(0)

  useEffect(() => {
    const rondel = ref.current
    if (!rondel) return
    rondel.innerHTML = ''
    const vertices = rondelVertices()

    const wheel = el('g', {})
    const circleLayer = el('g', {})
    const tokenLayer = el('g', {})
    let missing = 0

    for (let i = 0; i < RONDEL_SIDES; i++) {
      const a = vertices[i],
        b = vertices[(i + 1) % RONDEL_SIDES]
      const n = wedgeCount(i)
      const layout = canonicalLayout(cache.current, vertices, n, radius)
      if (layout === null) missing++

      wheel.appendChild(
        el('polyline', {
          points: `0,0 ${a[0]},${a[1]} ${b[0]},${b[1]} 0,0`,
          fill: layout === null ? '#fdeeee' : '#fcfcfc',
          stroke: layout === null ? '#e0a8a8' : '#b3b3b3',
          'stroke-width': '1'
        })
      )
      if (layout === null) continue

      const positions = rotate(layout, (-i * 2 * Math.PI) / RONDEL_SIDES)
      positions.forEach(p => {
        if (radius > 0) {
          circleLayer.appendChild(
            el('circle', {
              cx: p[0],
              cy: p[1],
              r: radius,
              fill: '#e8f2fb',
              stroke: '#9bb8d0',
              'stroke-width': '1'
            })
          )
        }
        const t = el('text', {
          x: p[0],
          y: p[1],
          'text-anchor': 'middle',
          'dominant-baseline': 'central',
          'font-size': String(RONDEL_TOKEN_SIZE)
        })
        t.textContent = RONDEL_TOKENS[i % RONDEL_TOKENS.length]
        tokenLayer.appendChild(t)
      })
    }

    rondel.appendChild(wheel)
    rondel.appendChild(circleLayer)
    rondel.appendChild(tokenLayer)
    setCrowded(missing)
  }, [radius])

  const step = delta => () =>
    setRadius(r => Math.min(MAX_RADIUS, Math.max(0, r + delta)))

  // 44px square is the smallest comfortable tap target, which is the whole
  // reason these are here — dragging the slider on a phone is a nuisance.
  const button = {
    width: 44,
    height: 44,
    flex: '0 0 auto',
    fontSize: '1.1em',
    lineHeight: 1,
    fontFamily: 'inherit',
    border: '1px solid #ccc',
    borderRadius: '4px',
    background: '#fafafa',
    cursor: 'pointer'
  }

  return (
    <div style={{ maxWidth: 520, margin: '2em auto' }}>
      <svg
        ref={ref}
        viewBox="-210.5 -210.5 420 420"
        style={{ width: '100%', display: 'block' }}
        aria-label={`A 13-sided rondel whose wedges hold 3 to 9 tokens, each token a circle of radius ${radius}`}
      />
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '.5em',
          marginTop: '1em',
          fontFamily: 'monospace'
        }}
      >
        <button
          type="button"
          onClick={step(-1)}
          disabled={radius === 0}
          aria-label="Decrease radius"
          style={button}
        >
          −
        </button>
        <input
          type="range"
          min="0"
          max={MAX_RADIUS}
          step="1"
          value={radius}
          onChange={e => setRadius(+e.target.value)}
          aria-label="Token radius"
          style={{ flex: 1, minWidth: 0 }}
        />
        <button
          type="button"
          onClick={step(1)}
          disabled={radius === MAX_RADIUS}
          aria-label="Increase radius"
          style={button}
        >
          +
        </button>
        <span style={{ width: '5.5em', textAlign: 'right' }}>r = {radius}</span>
      </div>
      <p style={{ fontSize: '.85em', opacity: 0.7, marginTop: '.5em' }}>
        {radius === 0
          ? 'At r = 0 the tokens are dimensionless points, so the crowded wedges overlap.'
          : crowded === 0
            ? 'Every wedge fits. No two circles overlap, and none crosses a wedge boundary.'
            : `${crowded} of ${RONDEL_SIDES} wedges cannot fit their tokens at this size.`}
      </p>
    </div>
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
