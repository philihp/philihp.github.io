---
layout: post
title: "Pointille : Répartir uniformément des points dans un polygone"
date: 2026-05-13T00:00:00Z
lang: fr
ref: announcing-pointille
categories: []
tags:
  - pointille
  - typescript
  - voronoi
  - lloyds-algorithm
  - halton-sequence
  - geometry
---

<svg id="rondel" style="float:right;width:450px;height:450px" viewBox="-210.5 -210.5 420 420" aria-label="Un rondel à 13 côtés avec des jetons emoji placés dans trois de ses secteurs"></svg>

Un problème qui me trotte dans la tête depuis quelque temps concerne un jeu avec un rondel comme celui montré ici. Je veux que ces jetons soient centrés uniformément dans chaque secteur d'un polygone régulier à 13 côtés (triskaidécagone). J'ai aussi rencontré ce problème en optimisant l'espace racinaire de plantes dans une parcelle de jardin de forme irrégulière. J'ai empaqueté mon approche sous le nom de [pointille](https://github.com/philihp/pointille), une petite bibliothèque TypeScript sur npm.

Nommé d'après le motif décoratif utilisé en bijouterie, [pointillé](https://fr.wikipedia.org/wiki/Pointill%C3%A9).

## Installation

```bash
npm install pointille
```

## Utilisation de base

`pointille` prend un polygone sous forme de tableau de sommets `[x, y]` et un compte, et renvoie autant de points répartis à l'intérieur du polygone.

```typescript
import { pointille } from 'pointille'

const carreUnitaire = [
  [0, 0],
  [1, 0],
  [1, 1],
  [0, 1],
] as const

const points = pointille(carreUnitaire, 25)
// => [
//   ...
//   [ 0.4973001454916204, 0.5078269245431213 ],
//   [ 0.902819350372445, 0.9059261510512003 ],
//   [ 0.13364467572889838, 0.25595086132355166 ],
//   [ 0.5177439763083426, 0.7246545345081363 ]
// ]
```

<div class="pointille-figure" id="pointille-fig-square"></div>

La fonction est pure et déterministe : le même polygone et le même `n` vous renverront toujours le même ensemble de points. Cela facilite son utilisation dans les tests, dans le rendu de snapshots, et partout où vous préférez éviter l'état caché.

## Polygones concaves

L'algorithme rogne les cellules de Voronoï contre le polygone d'entrée, donc les formes concaves fonctionnent aussi. Voici une forme en L :

```typescript
const formeL = [
  [0, 0],
  [2, 0],
  [2, 1],
  [1, 1],
  [1, 2],
  [0, 2],
] as const

const points = pointille(formeL, 40)
```

<div class="pointille-figure" id="pointille-fig-l"></div>

Aucun point ne s'échappera dans le coin manquant, et la densité le long des deux bras du L reste à peu près égale.

## Options

Deux paramètres optionnels valent la peine d'être connus :

```typescript
pointille(polygone, n, { iterations: 30, seed: 1 })
```

- `iterations` — le nombre d'étapes de relaxation de Lloyd à exécuter. La valeur par défaut de `30` suffit généralement pour que les points se stabilisent, mais en regardant de près la fin de la mantisse, vous pourriez repérer une asymétrie. Plus bas est plus rapide, plus haut vous rapproche d'une tessellation de Voronoï centroïdale parfaite.
- `seed` — l'indice de départ dans la séquence de Halton utilisée pour le placement initial des points. Le modifier vous donne une disposition différente (mais toujours déterministe). Utile quand vous voulez de la variété entre, disons, plusieurs tuiles rendues, sans compromettre la reproductibilité.

```typescript
const a = pointille(carreUnitaire, 25, { seed: 1 })
const b = pointille(carreUnitaire, 25, { seed: 2 })
// a et b sont tous deux uniformément répartis, mais différents l'un de l'autre.
// Relancer l'un ou l'autre appel renvoie un tableau équivalent.
```

## Comment ça marche

Il y a trois pièces :

1. **Séquence de Halton** — une séquence quasi-aléatoire à faible discrépance est utilisée pour initialiser les positions des points à l'intérieur de la boîte englobante du polygone, en rejetant tout point qui tombe à l'extérieur. Comparée à `Math.random()`, cette disposition de départ présente déjà beaucoup moins d'agrégats, donc vous partez d'un meilleur point.
2. **Masquage de Voronoï** — chaque itération calcule la tessellation de Voronoï des points actuels, puis rogne chaque cellule contre le polygone afin que les cellules aux bords ne dépassent pas les limites.
3. **Algorithme de Lloyd** — chaque point est déplacé vers le centroïde de sa cellule de Voronoï rognée. Répétez. Les points s'éloignent les uns des autres et tendent vers un espacement uniforme.

Le résultat est ce qu'on appelle une _tessellation de Voronoï centroïdale_ (CVT) : un pavage où chaque point se situe au centre de masse de sa propre cellule. C'est un point fixe du processus de relaxation, et une fois qu'on en est proche, les points cessent de bouger.

## Pourquoi pas l'échantillonnage Poisson-disque ?

L'[échantillonnage Poisson-disque](https://www.jasondavies.com/poisson-disc/) est la référence habituelle pour des points « répartis uniformément mais non en grille ». C'est un algorithme bien plus rapide qui produit un motif organique et naturel. Si vous vouliez un espacement plus intentionnel, avec une qualité plus cristalline, je pense que celui-ci serait préférable.

## Source

Le paquet est disponible sur npm sous le nom [pointille](https://www.npmjs.com/package/pointille), et le code source se trouve sur [github.com/philihp/pointille](https://github.com/philihp/pointille).

## Essayez-le

<div id="pointille-demo">
  <svg viewBox="-1.15 -1.15 2.3 2.3" preserveAspectRatio="xMidYMid meet" aria-label="Démo interactive de Pointille"></svg>
  <div class="controls">
    <label><span class="lbl">Côtés</span><input type="range" id="pointille-sides" min="3" max="7" value="5" step="1"><span class="val" id="pointille-sides-val">5</span></label>
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

  function renderRondel() {
    const rondel = document.getElementById('rondel')
    if (!rondel) return

    const R = 200
    const SIDES = 13
    const vertices = []
    for (let i = 0; i < SIDES; i++) {
      const a = -Math.PI / 2 - (i * 2 * Math.PI) / SIDES
      vertices.push([R * Math.cos(a), R * Math.sin(a)])
    }

    const defs = el('defs')
    const filter = el('filter', { id: 'rondel-shadow' })
    filter.appendChild(el('feGaussianBlur', { in: 'SourceGraphic', stdDeviation: '4' }))
    defs.appendChild(filter)
    rondel.appendChild(defs)

    const outline = vertices.map(v => v.join(',')).join(' ') + ' ' + vertices[0].join(',')
    const shadowG = el('g', { opacity: '0.2' })
    shadowG.appendChild(el('polyline', {
      points: outline, fill: 'black', filter: 'url(#rondel-shadow)',
    }))
    rondel.appendChild(shadowG)

    const wheel = el('g')
    for (let i = 0; i < SIDES; i++) {
      const a = vertices[i], b = vertices[(i + 1) % SIDES]
      wheel.appendChild(el('polyline', {
        points: `0,0 ${a[0]},${a[1]} ${b[0]},${b[1]} 0,0`,
        fill: '#fcfcfc', stroke: '#b3b3b3', 'stroke-width': '1',
      }))
    }
    rondel.appendChild(wheel)

    const wedges = {
      0: ['🌾', '🐑', '🪙'],
      1: ['🪵', '🧱'],
      2: ['🃏', '💩'],
    }

    const tokenLayer = el('g')
    for (const key in wedges) {
      const i = +key
      const emojis = wedges[key]
      const wedgePolygon = [[0, 0], vertices[i], vertices[(i + 1) % SIDES]]
      const positions = pointille(wedgePolygon, emojis.length, { iterations: 60 })
      emojis.forEach((emoji, j) => {
        const t = el('text', {
          x: positions[j][0],
          y: positions[j][1],
          'text-anchor': 'middle',
          'dominant-baseline': 'central',
          'font-size': '28',
        })
        t.textContent = emoji
        tokenLayer.appendChild(t)
      })
    }
    rondel.appendChild(tokenLayer)
  }

  renderRondel()
</script>
