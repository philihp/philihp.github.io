---
layout: post
title: "Announcing Pointille: Evenly Distributing Points in a Polygon"
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

I have been chipping away at a small problem for a while: given an arbitrary polygon and a count `n`, how do you scatter `n` points inside the polygon so that they look _evenly spaced_? Not on a grid (which betrays the polygon's edges) and not purely random (which clumps and leaves gaps). Pointillist painters were solving this same problem by hand a century ago, dotting paint onto canvas in distributions that read as uniform to the eye without being mechanical.

I've packaged my approach as [pointille](https://github.com/philihp/pointille), a small TypeScript library on npm.

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
// => 25 [x, y] tuples, approximately evenly spread inside the square
```

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

No points will leak into the missing corner, and the density along the two arms of the L stays roughly equal.

## Options

There are two optional parameters worth knowing about:

```typescript
pointille(polygon, n, { iterations: 30, seed: 1 })
```

- `iterations` — how many Lloyd relaxation steps to run. The default of `30` is usually enough for the points to settle. Fewer iterations is faster but more clustered; more iterations approaches a perfect centroidal Voronoi tessellation with diminishing returns.
- `seed` — the starting index into the Halton sequence used for the initial point placement. Changing it gives you a different (but still deterministic) layout. Useful when you want variety across, say, several rendered tiles, without giving up reproducibility.

```typescript
const a = pointille(unitSquare, 25, { seed: 1 })
const b = pointille(unitSquare, 25, { seed: 2 })
// a and b are both evenly distributed, but different from each other.
// Running either call again returns the exact same array.
```

## How It Works

There are three pieces:

1. **Halton sequence** — a low-discrepancy quasi-random sequence is used to seed initial point positions inside the polygon's bounding box, rejecting any points that fall outside the polygon. Compared to `Math.random()`, this starting layout already has much less clumping.
2. **Voronoi diagram** — each iteration computes the Voronoi tessellation of the current points, then clips each cell against the polygon so that cells along the boundary don't extend past the edge.
3. **Lloyd's algorithm** — each point is moved to the centroid of its clipped Voronoi cell. Repeat. Points drift apart from each other and toward an even spacing.

The result is what's called a _centroidal Voronoi tessellation_ (CVT): a tiling where every point sits at the center of mass of its own cell. It's a fixed point of the relaxation process, and once you're close to it, the points stop moving.

## Why Not Just Poisson-Disk Sampling?

Poisson-disk sampling is the usual go-to for "evenly spread but not gridded" points, and it's great. The main reasons I reached for CVT/Lloyd instead:

- You specify exactly how many points you want. Poisson-disk gives you whatever fits a minimum-distance constraint.
- Lloyd relaxation converges to a global property (every point at its cell's centroid), which to my eye reads as more uniform for small `n`.
- It's deterministic with no rejection sampling loop.

Use the right tool for the job; for a few hundred well-placed dots on a fixed-area polygon, this fits.

## Source

The package is available on npm as [pointille](https://www.npmjs.com/package/pointille), and source lives at [github.com/philihp/pointille](https://github.com/philihp/pointille).

## Try It

Drag the sliders to choose a regular polygon (3–13 sides) and a count of points (2–10). The library places the points; the Voronoi cells around each one are computed live in your browser.

<div id="pointille-demo">
  <svg viewBox="-1.15 -1.15 2.3 2.3" preserveAspectRatio="xMidYMid meet" aria-label="Pointille interactive demo"></svg>
  <div class="controls">
    <label><span class="lbl">Sides</span><input type="range" id="pointille-sides" min="3" max="13" value="5" step="1"><span class="val" id="pointille-sides-val">5</span></label>
    <label><span class="lbl">Points</span><input type="range" id="pointille-points" min="2" max="10" value="6" step="1"><span class="val" id="pointille-points-val">6</span></label>
  </div>
</div>

<style>
  #pointille-demo { max-width: 520px; margin: 2em auto; }
  #pointille-demo svg { width: 100%; aspect-ratio: 1 / 1; background: #fafafa; border: 1px solid #eee; display: block; }
  #pointille-demo .controls { display: flex; flex-direction: column; gap: .5em; margin-top: 1em; font-family: monospace; }
  #pointille-demo .controls label { display: flex; align-items: center; gap: .75em; }
  #pointille-demo .controls .lbl { width: 4em; }
  #pointille-demo .controls .val { width: 2em; text-align: right; }
  #pointille-demo .controls input[type=range] { flex: 1; }
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

  function pointInConvexPolygonCCW(p, polygon) {
    for (let i = 0; i < polygon.length; i++) {
      const a = polygon[i]
      const b = polygon[(i + 1) % polygon.length]
      const c = (b[0] - a[0]) * (p[1] - a[1]) - (b[1] - a[1]) * (p[0] - a[0])
      if (c < 0) return false
    }
    return true
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
      if (pointInConvexPolygonCCW(p, polygon)) points.push(p)
      i++
    }
    for (let it = 0; it < iterations; it++) {
      const cells = voronoiCells(points, polygon)
      for (let k = 0; k < points.length; k++) {
        if (cells[k].length >= 3) points[k] = polygonCentroid(cells[k])
      }
    }
    return points
  }

  function el(name, attrs) {
    const e = document.createElementNS(NS, name)
    for (const k in attrs) e.setAttribute(k, attrs[k])
    return e
  }

  function render() {
    const n = +sidesEl.value
    const k = +pointsEl.value
    sidesVal.textContent = n
    pointsVal.textContent = k

    const polygon = regularPolygon(n)
    const points = pointille(polygon, k)
    const cells = voronoiCells(points, polygon)

    while (svg.firstChild) svg.removeChild(svg.firstChild)
    // Flip y so positive y points up, matching the math.
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

    points.forEach(p => {
      g.appendChild(el('circle', {
        cx: p[0], cy: p[1], r: '0.028', fill: '#222',
      }))
    })
  }

  sidesEl.addEventListener('input', render)
  pointsEl.addEventListener('input', render)
  render()
</script>

