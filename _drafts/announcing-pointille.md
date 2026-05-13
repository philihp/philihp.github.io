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
