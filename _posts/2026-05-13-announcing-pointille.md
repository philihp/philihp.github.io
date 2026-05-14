---
layout: post
title: "Pointille: Evenly Distributing Points in a Polygon"
date: 2026-05-13T00:00:00Z
categories: []
tags:
  - pointille
  - typescript
  - voronoi
  - lloyds-algorithm
  - halton-sequence
  - geometry
---

<svg style="float:right;width:450px;height:450px" viewBox="-210.5 -210.5 420 420"><defs><linearGradient id="housefill" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" style="stop-color:#004e85;stop-opacity:1"></stop><stop offset="100%" style="stop-color:#1973b2;stop-opacity:1"></stop></linearGradient><filter id="shadow"><feGaussianBlur in="SourceGraphic" stdDeviation="4"></feGaussianBlur></filter></defs><g id="shadowMask" opacity="0.2"><polyline points="0,-200 -92.9446344,-177.0912051 -164.5967732,-113.6129493 -198.5417748,-24.1073361 -187.0032485,70.9209774 -132.6245316,149.7021496 -47.8631329,194.1883635 47.8631329,194.1883635 132.6245316,149.7021496 187.0032485,70.9209774 198.5417748,-24.1073361 164.5967732,-113.6129493 92.9446344,-177.0912051 0,-200 " fill="black" filter="url(#shadow)"></polyline></g><g id="wheel"><polyline fill="#fcfcfc" stroke="#b3b3b3" stroke-width="1" points="0,0 0,-200 -92.9446344,-177.0912051 0,0"></polyline><polyline fill="#fcfcfc" stroke="#b3b3b3" stroke-width="1" points="0,0 -92.9446344,-177.0912051 -164.5967732,-113.6129493 0,0"></polyline><polyline fill="#fcfcfc" stroke="#b3b3b3" stroke-width="1" points="0,0 -164.5967732,-113.6129493 -198.5417748,-24.1073361 0,0"></polyline><polyline fill="#fcfcfc" stroke="#b3b3b3" stroke-width="1" points="0,0 -198.5417748,-24.1073361 -187.0032485,70.9209774 0,0"></polyline><polyline fill="#fcfcfc" stroke="#b3b3b3" stroke-width="1" points="0,0 -187.0032485,70.9209774 -132.6245316,149.7021496 0,0"></polyline><polyline fill="#fcfcfc" stroke="#b3b3b3" stroke-width="1" points="0,0 -132.6245316,149.7021496 -47.8631329,194.1883635 0,0"></polyline><polyline fill="#fcfcfc" stroke="#b3b3b3" stroke-width="1" points="0,0 -47.8631329,194.1883635 47.8631329,194.1883635 0,0"></polyline><polyline fill="#fcfcfc" stroke="#b3b3b3" stroke-width="1" points="0,0 47.8631329,194.1883635 132.6245316,149.7021496 0,0"></polyline><polyline fill="#fcfcfc" stroke="#b3b3b3" stroke-width="1" points="0,0 132.6245316,149.7021496 187.0032485,70.9209774 0,0"></polyline><polyline fill="#fcfcfc" stroke="#b3b3b3" stroke-width="1" points="0,0 187.0032485,70.9209774 198.5417748,-24.1073361 0,0"></polyline><polyline fill="#fcfcfc" stroke="#b3b3b3" stroke-width="1" points="0,0 198.5417748,-24.1073361 164.5967732,-113.6129493 0,0"></polyline><polyline fill="#fcfcfc" stroke="#b3b3b3" stroke-width="1" points="0,0 164.5967732,-113.6129493 92.9446344,-177.0912051 0,0"></polyline><polyline fill="#fcfcfc" stroke="#b3b3b3" stroke-width="1" points="0,0 92.9446344,-177.0912051 0,-200 0,0"></polyline></g><g id="grain" transform="rotate(346.15384615384613)"><text x="13" y="-146" class="rondel_token__lMZWd">🌾</text></g><g id="sheep" transform="rotate(346.15384615384613)"><text x="-13" y="-146" class="rondel_token__lMZWd">🐑</text></g><g id="joker" transform="rotate(290.7692307692308)"><text x="11" y="-123.5" class="rondel_token__lMZWd">🃏</text></g><g id="wood" transform="rotate(318.46153846153845)"><text x="-11" y="-123.5" class="rondel_token__lMZWd">🪵</text></g><g id="clay" transform="rotate(318.46153846153845)"><text x="-9" y="-105.5" class="rondel_token__lMZWd">🧱</text></g><g id="peat" transform="rotate(290.7692307692308)"><text x="9" y="-105.5" class="rondel_token__lMZWd">💩</text></g><g id="coin" transform="rotate(346.15384615384613)"><text x="0" y="-87" class="rondel_token__lMZWd">🪙</text></g></svg>

A problem that's been nagging me for a while involves a game with a rondel shown here. I want these tokens to be centered evenly in each wedge of a regular 13-sided polygon (triskaidecagon). I've also been seeing this problem in rootspace maxxing plants in an irregularly shaped garden plot. I've packaged my approach as [pointille](https://github.com/philihp/pointille), a small TypeScript library on npm.

Named after the decorative pattern used in jewelry, [pointillé](https://en.wikipedia.org/wiki/Pointillé).

## Install

```bash
npm install pointille
```

## Basic Usage

`pointille` takes a polygon as an array of `[x, y]` vertices and a count, and returns that many points distributed inside the polygon.

```typescript
import { pointille } from 'pointille'

const unitSquare = [
  [0, 0],
  [1, 0],
  [1, 1],
  [0, 1],
] as const

const points = pointille(unitSquare, 25)
// => [
//   ...
//   [ 0.4973001454916204, 0.5078269245431213 ],
//   [ 0.902819350372445, 0.9059261510512003 ],
//   [ 0.13364467572889838, 0.25595086132355166 ],
//   [ 0.5177439763083426, 0.7246545345081363 ]
// ]
```

<div class="pointille-figure" id="pointille-fig-square"></div>

The function is pure and deterministic: the same polygon and the same `n` will always give you back the same set of points. That makes it easy to use in tests, in snapshot rendering, and anywhere else you'd rather not deal with hidden state.

## Concave Polygons

The algorithm clips Voronoi cells against the input polygon, so concave shapes work too. Here's an L-shape:

```typescript
const lShape = [
  [0, 0],
  [2, 0],
  [2, 1],
  [1, 1],
  [1, 2],
  [0, 2],
] as const

const points = pointille(lShape, 40)
```

<div class="pointille-figure" id="pointille-fig-l"></div>

No points will leak into the missing corner, and the density along the two arms of the L stays roughly equal.

## Options

There are two optional parameters worth knowing about:

```typescript
pointille(polygon, n, { iterations: 30, seed: 1 })
```

- `iterations` — how many Lloyd relaxation steps to run. The default of `30` is usually enough for the points to settle, but peep the tail end of the mantissa and you might spot asymmetry. Lower is faster, higher gets you closer to a perfect centroidal Voronoi tessellation.
- `seed` — the starting index into the Halton sequence used for the initial point placement. Changing it gives you a different (but still deterministic) layout. Useful when you want variety across, say, several rendered tiles, without compromising reproducibility.

```typescript
const a = pointille(unitSquare, 25, { seed: 1 })
const b = pointille(unitSquare, 25, { seed: 2 })
// a and b are both evenly distributed, but different from each other.
// Running either call again returns an equivalent array.
```

## How It Works

There are three pieces:

1. **Halton sequence** — a low-discrepancy quasi-random sequence is used to seed initial point positions inside the polygon's bounding box, rejecting any points that fall outside the polygon. Compared to `Math.random()`, this starting layout already has much less clumping so you start from a better place.
2. **Voronoi masking** — each iteration computes the Voronoi tessellation of the current points, then clips each cell against the polygon so that cells along the boundary don't extend past the edge.
3. **Lloyd's algorithm** — each point is moved to the centroid of its clipped Voronoi cell. Repeat. Points drift apart from each other and toward an even spacing.

The result is what's called a _centroidal Voronoi tessellation_ (CVT): a tiling where every point sits at the center of mass of its own cell. It's a fixed point of the relaxation process, and once you're close to it, the points stop moving.

## Why Not Poisson-Disk Sampling?

[Poisson-disk sampling](https://www.jasondavies.com/poisson-disc/) is the usual go-to for "evenly spread but not gridded" points. It's a much faster algorithm which generates a nice organic and natural pattern. If you wanted something more intentionally spaced, with a more crystalline quality to it, I think this would be better.

## Source

The package is available on npm as [pointille](https://www.npmjs.com/package/pointille), and source lives at [github.com/philihp/pointille](https://github.com/philihp/pointille).

## Try It

<div id="pointille-demo">
  <svg viewBox="-1.15 -1.15 2.3 2.3" preserveAspectRatio="xMidYMid meet" aria-label="Pointille interactive demo"></svg>
  <div class="controls">
    <label><span class="lbl">Sides</span><input type="range" id="pointille-sides" min="3" max="7" value="5" step="1"><span class="val" id="pointille-sides-val">5</span></label>
    <label><span class="lbl">Points</span><input type="range" id="pointille-points" min="1" max="100" value="25" step="1"><span class="val" id="pointille-points-val">25</span></label>
  </div>
</div>

<style>
  #pointille-demo { max-width: 520px; margin: 2em auto; }
  #pointille-demo svg { width: 100%; aspect-ratio: 1 / 1; background: #fafafa; border: 1px solid #eee; display: block; }
  #pointille-demo .controls { display: flex; flex-direction: column; gap: .5em; margin-top: 1em; font-family: monospace; }
  #pointille-demo .controls label { display: flex; align-items: center; gap: .75em; }
  #pointille-demo .controls .lbl { width: 4em; }
  #pointille-demo .controls .val { width: 2.5em; text-align: right; }
  #pointille-demo .controls input[type=range] { flex: 1; }
  .pointille-figure { max-width: 320px; margin: 1.25em auto; }
  .pointille-figure svg { width: 100%; display: block; background: #fafafa; border: 1px solid #eee; }
</style>

<script>
  const svg = document.querySelector('#pointille-demo svg')
  const sidesEl = document.getElementById('pointille-sides')
  const pointsEl = document.getElementById('pointille-points')
  const sidesVal = document.getElementById('pointille-sides-val')
  const pointsVal = document.getElementById('pointille-points-val')
  const NS = 'http://www.w3.org/2000/svg'
  const palette = ['#fde8e8','#e8f5fd','#eafde8','#fdf5e8','#f5e8fd','#e8fdf5','#fdeae8','#e8eafd','#fdfde8','#e8fdfd']

  function regularPolygon(n) {
    const pts = []
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (i * 2 * Math.PI) / n
      pts.push([Math.cos(a), Math.sin(a)])
    }
    return pts
  }

  // Clip convex polygon to the half-plane of points closer to `a` than `b`.
  function clipHalfPlane(poly, a, b) {
    const dx = b[0] - a[0], dy = b[1] - a[1]
    const mx = (a[0] + b[0]) / 2, my = (a[1] + b[1]) / 2
    const f = p => (p[0] - mx) * dx + (p[1] - my) * dy
    const out = []
    for (let i = 0; i < poly.length; i++) {
      const p = poly[i]
      const q = poly[(i + 1) % poly.length]
      const fp = f(p), fq = f(q)
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
    let f = 1, r = 0
    while (i > 0) {
      f /= base
      r += f * (i % base)
      i = Math.floor(i / base)
    }
    return r
  }

  function pointInPolygon(p, polygon) {
    let inside = false
    const px = p[0], py = p[1]
    for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
      const xi = polygon[i][0], yi = polygon[i][1]
      const xj = polygon[j][0], yj = polygon[j][1]
      if (((yi > py) !== (yj > py)) &&
          (px < ((xj - xi) * (py - yi)) / (yj - yi) + xi)) {
        inside = !inside
      }
    }
    return inside
  }

  function polygonCentroid(poly) {
    let cx = 0, cy = 0, A = 0
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
      let sx = 0, sy = 0
      for (const [x, y] of poly) { sx += x; sy += y }
      return [sx / poly.length, sy / poly.length]
    }
    return [cx / (6 * A), cy / (6 * A)]
  }

  // Vendored pointille: seed with 2D Halton, then Lloyd-relax against the polygon.
  function pointille(polygon, n, { iterations = 30, seed = 1 } = {}) {
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    for (const [x, y] of polygon) {
      if (x < minX) minX = x; if (y < minY) minY = y
      if (x > maxX) maxX = x; if (y > maxY) maxY = y
    }
    const W = maxX - minX, H = maxY - minY
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

  function el(name, attrs) {
    const e = document.createElementNS(NS, name)
    for (const k in attrs) e.setAttribute(k, attrs[k])
    return e
  }

  function render(polygon, points) {
    const cells = voronoiCells(points, polygon)

    while (svg.firstChild) svg.removeChild(svg.firstChild)
    const g = el('g', { transform: 'scale(1,-1)' })
    svg.appendChild(g)

    cells.forEach((cell, i) => {
      if (cell.length < 3) return
      g.appendChild(el('polygon', {
        points: cell.map(p => p.join(',')).join(' '),
        fill: palette[i % palette.length],
        stroke: '#bbb',
        'stroke-width': '0.006',
        'stroke-linejoin': 'round',
      }))
    })

    g.appendChild(el('polygon', {
      points: polygon.map(p => p.join(',')).join(' '),
      fill: 'none',
      stroke: '#333',
      'stroke-width': '0.012',
      'stroke-linejoin': 'round',
    }))

    const k = points.length
    const r = Math.max(0.005, Math.min(0.04, 0.05 / Math.sqrt(k)))
    points.forEach(p => {
      g.appendChild(el('circle', {
        cx: p[0], cy: p[1], r: r, fill: '#222',
      }))
    })
  }

  function easeInOut(t) {
    return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2
  }

  // Resample a closed polygon to K vertices evenly along its perimeter,
  // starting at the polygon's first vertex. Lets us tween between polygons
  // that have different vertex counts.
  function resamplePolygon(polygon, K) {
    const N = polygon.length
    const lens = new Array(N)
    let total = 0
    for (let i = 0; i < N; i++) {
      const a = polygon[i], b = polygon[(i + 1) % N]
      const dx = b[0] - a[0], dy = b[1] - a[1]
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
      const a = polygon[i], b = polygon[(i + 1) % N]
      out[k] = [a[0] + t * (b[0] - a[0]), a[1] + t * (b[1] - a[1])]
    }
    return out
  }

  // Greedy globally-shortest-pair matching from `from` to `to`. Returns a
  // ptFrom[] of length to.length where each entry is the matched source point
  // (or a clone of the target if there was no source to match).
  function pairPoints(from, to) {
    const M = from.length, N = to.length
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
    const usedF = new Uint8Array(M), usedT = new Uint8Array(N)
    let filled = 0
    for (let p = 0; p < pairs.length && filled < N; p++) {
      const [, i, j] = pairs[p]
      if (usedF[i] || usedT[j]) continue
      ptFrom[j] = [from[i][0], from[i][1]]
      usedF[i] = 1; usedT[j] = 1; filled++
    }
    for (let j = 0; j < N; j++) {
      if (!ptFrom[j]) ptFrom[j] = [to[j][0], to[j][1]]
    }
    return ptFrom
  }

  const state = {
    displayPolygon: regularPolygon(+sidesEl.value),
    displayPoints: null,
    anim: null,
    rafId: 0,
  }
  state.displayPoints = pointille(state.displayPolygon, +pointsEl.value)

  function startTransition() {
    const n = +sidesEl.value
    const k = +pointsEl.value
    sidesVal.textContent = n
    pointsVal.textContent = k
    const targetPolygon = regularPolygon(n)
    const targetPoints = pointille(targetPolygon, k)
    const K = Math.max(state.displayPolygon.length, targetPolygon.length)
    const polyFrom = resamplePolygon(state.displayPolygon, K)
    const polyTo = resamplePolygon(targetPolygon, K)
    const ptFrom = pairPoints(state.displayPoints, targetPoints)
    state.anim = {
      start: performance.now(),
      dur: 350,
      polyFrom, polyTo, ptFrom, ptTo: targetPoints,
      targetPolygon,
    }
    if (!state.rafId) state.rafId = requestAnimationFrame(tick)
  }

  function tick(now) {
    state.rafId = 0
    const a = state.anim
    if (!a) return
    const t = Math.min(1, (now - a.start) / a.dur)
    if (t >= 1) {
      // Snap to the un-resampled target so the final shape is the real
      // regular polygon, not a vertex-padded approximation of it.
      state.displayPolygon = a.targetPolygon
      state.displayPoints = a.ptTo
      state.anim = null
      render(a.targetPolygon, a.ptTo)
      return
    }
    const tt = easeInOut(t)
    const poly = a.polyFrom.map((p, i) => [
      p[0] + (a.polyTo[i][0] - p[0]) * tt,
      p[1] + (a.polyTo[i][1] - p[1]) * tt,
    ])
    const pts = a.ptFrom.map((p, i) => [
      p[0] + (a.ptTo[i][0] - p[0]) * tt,
      p[1] + (a.ptTo[i][1] - p[1]) * tt,
    ])
    state.displayPolygon = poly
    state.displayPoints = pts
    render(poly, pts)
    state.rafId = requestAnimationFrame(tick)
  }

  function renderFigure(containerId, polygon, n) {
    const container = document.getElementById(containerId)
    if (!container) return
    const points = pointille(polygon, n)
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    for (const [x, y] of polygon) {
      if (x < minX) minX = x; if (y < minY) minY = y
      if (x > maxX) maxX = x; if (y > maxY) maxY = y
    }
    const w = maxX - minX, h = maxY - minY
    const span = Math.max(w, h)
    const pad = span * 0.08
    const svgEl = document.createElementNS(NS, 'svg')
    svgEl.setAttribute('viewBox', `${minX - pad} ${-maxY - pad} ${w + 2 * pad} ${h + 2 * pad}`)
    svgEl.setAttribute('preserveAspectRatio', 'xMidYMid meet')
    svgEl.setAttribute('style', `aspect-ratio: ${(w + 2 * pad)} / ${(h + 2 * pad)}`)
    const g = el('g', { transform: 'scale(1,-1)' })
    svgEl.appendChild(g)
    g.appendChild(el('polygon', {
      points: polygon.map(p => p.join(',')).join(' '),
      fill: 'none',
      stroke: '#333',
      'stroke-width': span * 0.008,
      'stroke-linejoin': 'round',
    }))
    const r = span * 0.018
    points.forEach(p => {
      g.appendChild(el('circle', { cx: p[0], cy: p[1], r: r, fill: '#222' }))
    })
    container.innerHTML = ''
    container.appendChild(svgEl)
  }

  renderFigure('pointille-fig-square', [[0,0],[1,0],[1,1],[0,1]], 25)
  renderFigure('pointille-fig-l', [[0,0],[2,0],[2,1],[1,1],[1,2],[0,2]], 40)

  sidesEl.addEventListener('input', startTransition)
  pointsEl.addEventListener('input', startTransition)
  sidesVal.textContent = sidesEl.value
  pointsVal.textContent = pointsEl.value
  render(state.displayPolygon, state.displayPoints)
</script>

