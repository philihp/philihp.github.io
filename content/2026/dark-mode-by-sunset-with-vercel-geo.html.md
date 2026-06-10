---
title: "Dark mode by sunset, with Vercel's edge geolocation"
date: 2026-05-31
tags:
  - "vercel"
  - "nextjs"
  - "edge-middleware"
  - "dark-mode"
  - "geolocation"
  - "hebcal-noaa"
  - "temporal"
author: "Philihp Busby"
---

`prefers-color-scheme` just mirrors the OS theme, which most people set once and forget. What I actually want to know is whether it's dark outside _where the visitor is sitting right now_, so I don't flashbang someone loading the site at 11pm.

The obvious move is to check the time of day, but the wall clock depends on the system timezone, and I keep mine on UTC so my log timestamps line up. My laptop thinks it's afternoon when it's dark out, and I doubt I'm the only one who's done that. The clock lies. Where you are doesn't, and Vercel hands me the visitor's location on every edge request. From a coordinate I can compute their actual sunrise and sunset.

The plan:

1. If the visitor already picked a theme, get out of the way.
2. Otherwise, work out if the sun is down where they are. Dark if it is.
3. No location (localhost, a privacy proxy), fall back to `prefers-color-scheme`.

## Reading geolocation at the edge

`request.geo` was removed, so location now comes from the `geolocation` helper in `@vercel/functions`. For the sun math I used [`@hebcal/noaa`](https://github.com/hebcal/noaa-solar-calc) — it implements NOAA's algorithm and ships its own TypeScript types instead of a stale `@types` package. It's built on [`Temporal`](https://tc39.es/proposal-temporal/docs/), so grab the polyfill too.

```bash
npm install @vercel/functions @hebcal/noaa temporal-polyfill
```

The whole of `middleware.ts`:

```ts
import { NextRequest, NextResponse } from 'next/server'
import { geolocation } from '@vercel/functions'
import { GeoLocation, NOAACalculator } from '@hebcal/noaa'
import { Temporal } from 'temporal-polyfill'

export const config = {
  // don't bother running on static assets
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}

export function middleware(request: NextRequest) {
  // Already chose? Respect it and bail.
  let theme = request.cookies.get('theme')?.value

  if (!theme) {
    const { latitude, longitude } = geolocation(request)
    const tzid = request.headers.get('x-vercel-ip-timezone')

    if (latitude && longitude && tzid) {
      const geo = new GeoLocation(null, +latitude, +longitude, 0, tzid)
      const noaa = new NOAACalculator(geo, Temporal.Now.plainDateISO(tzid))
      const sunrise = noaa.getSunrise()
      const sunset = noaa.getSunset()

      // null in the land of the midnight sun — leave it to the browser
      if (sunrise && sunset) {
        const now = Temporal.Now.instant()
        const isNight =
          Temporal.Instant.compare(now, sunrise.toInstant()) < 0 ||
          Temporal.Instant.compare(now, sunset.toInstant()) > 0
        theme = isNight ? 'dark' : 'light'
      }
    }
  }

  // Forward the decision to the app as a request header.
  const headers = new Headers(request.headers)
  if (theme) headers.set('x-theme', theme)
  return NextResponse.next({ request: { headers } })
}
```

There's a timezone in here (`x-vercel-ip-timezone`), but it's the visitor's, derived from their IP — a fact about them, like their latitude, never my server's clock. The comparison runs on `Temporal.Instant`s, which are absolute moments with no zone attached, so my UTC laptop gets no vote.

Two edge cases fall through to the browser default: `getSunrise`/`getSunset` return `null` near the poles where the sun doesn't rise or set, and none of these edge headers exist on localhost — so you can develop without pretending to be in Reykjavík.

## Rendering it without a flash

The decision goes out as a request header, not a cookie. I want the `theme` cookie to mean only "the human explicitly chose this" — writing the geo guess into it would make the "already chose?" check true forever, and the sun would never get another vote at dusk.

The root layout reads the header server-side, so the right class is in the first byte of HTML and there's no flash:

```tsx
import { headers } from 'next/headers'

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const theme = (await headers()).get('x-theme') // 'dark' | 'light' | null

  return (
    <html lang="en" data-theme={theme ?? undefined} suppressHydrationWarning>
      <body>{children}</body>
    </html>
  )
}
```

When the edge has no opinion the attribute is omitted, and that absence hands control back to the browser.

## Letting CSS handle the fallback

An explicit `data-theme` wins; without it, `prefers-color-scheme` is in charge.

```css
:root {
  color-scheme: light;
  --bg: #ffffff;
  --fg: #111111;
}

/* Fallback: only when the edge gave us nothing to go on. */
@media (prefers-color-scheme: dark) {
  :root:not([data-theme]) {
    color-scheme: dark;
    --bg: #111111;
    --fg: #eeeeee;
  }
}

/* An explicit decision — from geo or the toggle — overrides everything. */
:root[data-theme='dark'] {
  color-scheme: dark;
  --bg: #111111;
  --fg: #eeeeee;
}

:root[data-theme='light'] {
  color-scheme: light;
  --bg: #ffffff;
  --fg: #111111;
}
```

The `:not([data-theme])` does the quiet work, scoping the media query to fire only when there's no override, so geo and the browser default never fight.

## The toggle

The visitor gets the last word. The toggle writes the `theme` cookie and flips the attribute, and the middleware's first check defers to it from then on.

```ts
function setTheme(theme: 'dark' | 'light') {
  document.documentElement.dataset.theme = theme
  // a year, so the sun stops voting once they've decided
  document.cookie = `theme=${theme}; path=/; max-age=31536000; samesite=lax`
}
```

So the precedence runs: what the visitor clicked, then what the sun is doing where they are, then whatever their browser prefers — each layer consulted only when the one above has nothing to say.
