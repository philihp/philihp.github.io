// Low-precision lunar position, ported from Paul Schlyter's "Computing
// planetary positions" (https://stjarnhimlen.se/comp/ppcomp.html). Accurate to
// a few arc-minutes — plenty for showing where the Moon is in the sky.

const DEG = 180 / Math.PI
const rad = Math.PI / 180

const sin = d => Math.sin(d * rad)
const cos = d => Math.cos(d * rad)
const asin = x => Math.asin(Math.min(1, Math.max(-1, x))) * DEG
const acos = x => Math.acos(Math.min(1, Math.max(-1, x))) * DEG
const atan2 = (y, x) => Math.atan2(y, x) * DEG
const rev = x => ((x % 360) + 360) % 360

const phaseName = age => {
  if (age < 22.5 || age >= 337.5) return 'New Moon'
  if (age < 67.5) return 'Waxing Crescent'
  if (age < 112.5) return 'First Quarter'
  if (age < 157.5) return 'Waxing Gibbous'
  if (age < 202.5) return 'Full Moon'
  if (age < 247.5) return 'Waning Gibbous'
  if (age < 292.5) return 'Last Quarter'
  return 'Waning Crescent'
}

export const moonPosition = (date, lat, lon) => {
  const jd = date.getTime() / 86400000 + 2440587.5
  const d = jd - 2451543.5 // days since 1999-12-31 00:00 UT
  const UT =
    date.getUTCHours() +
    date.getUTCMinutes() / 60 +
    date.getUTCSeconds() / 3600 +
    date.getUTCMilliseconds() / 3600000

  // --- Sun (needed for perturbations, sidereal time and the phase) ---
  const ws = 282.9404 + 4.70935e-5 * d
  const Ms = rev(356.047 + 0.9856002585 * d)
  const es = 0.016709 - 1.151e-9 * d
  const Esun = Ms + es * DEG * sin(Ms) * (1 + es * cos(Ms))
  const vsun = atan2(Math.sqrt(1 - es * es) * sin(Esun), cos(Esun) - es)
  const lonsun = rev(vsun + ws)
  const Lsun = rev(Ms + ws) // sun's mean longitude

  // --- Moon orbital elements ---
  const N = rev(125.1228 - 0.0529538083 * d)
  const i = 5.1454
  const w = rev(318.0634 + 0.1643573223 * d)
  const a = 60.2666 // Earth radii
  const e = 0.0549
  const M = rev(115.3654 + 13.0649929509 * d)

  // Eccentric anomaly (two iterations of Newton's method).
  let E = M + e * DEG * sin(M) * (1 + e * cos(M))
  for (let k = 0; k < 2; k++) {
    E = E - (E - e * DEG * sin(E) - M) / (1 - e * cos(E))
  }

  const x = a * (cos(E) - e)
  const y = a * Math.sqrt(1 - e * e) * sin(E)
  let r = Math.sqrt(x * x + y * y) // Earth radii
  const v = rev(atan2(y, x))

  // Geocentric ecliptic coordinates.
  const xeclip = r * (cos(N) * cos(v + w) - sin(N) * sin(v + w) * cos(i))
  const yeclip = r * (sin(N) * cos(v + w) + cos(N) * sin(v + w) * cos(i))
  const zeclip = r * sin(v + w) * sin(i)

  let lonecl = rev(atan2(yeclip, xeclip))
  let latecl = atan2(zeclip, Math.sqrt(xeclip * xeclip + yeclip * yeclip))

  // Main perturbations.
  const Lm = rev(N + w + M)
  const D = rev(Lm - Lsun)
  const F = rev(Lm - N)

  lonecl +=
    -1.274 * sin(M - 2 * D) +
    0.658 * sin(2 * D) +
    -0.186 * sin(Ms) +
    -0.059 * sin(2 * M - 2 * D) +
    -0.057 * sin(M - 2 * D + Ms) +
    0.053 * sin(M + 2 * D) +
    0.046 * sin(2 * D - Ms) +
    0.041 * sin(M - Ms) +
    -0.035 * sin(D) +
    -0.031 * sin(M + Ms) +
    -0.015 * sin(2 * F - 2 * D) +
    0.011 * sin(M - 4 * D)
  latecl +=
    -0.173 * sin(F - 2 * D) +
    -0.055 * sin(M - F - 2 * D) +
    -0.046 * sin(M + F - 2 * D) +
    0.033 * sin(F + 2 * D) +
    0.017 * sin(2 * M + F)
  r += -0.58 * cos(M - 2 * D) + -0.46 * cos(2 * D)
  lonecl = rev(lonecl)

  // Ecliptic -> equatorial.
  const xg = r * cos(lonecl) * cos(latecl)
  const yg = r * sin(lonecl) * cos(latecl)
  const zg = r * sin(latecl)

  const ecl = 23.4393 - 3.563e-7 * d
  const xe = xg
  const ye = yg * cos(ecl) - zg * sin(ecl)
  const ze = yg * sin(ecl) + zg * cos(ecl)

  const RA = rev(atan2(ye, xe))
  const Dec = atan2(ze, Math.sqrt(xe * xe + ye * ye))

  // Equatorial -> horizontal.
  const GMST0 = rev(Lsun + 180)
  const LST = rev(GMST0 + UT * 15 + lon)
  const HA = rev(LST - RA)

  const xh = cos(HA) * cos(Dec)
  const yh = sin(HA) * cos(Dec)
  const zh = sin(Dec)

  const xhor = xh * sin(lat) - zh * cos(lat)
  const yhor = yh
  const zhor = xh * cos(lat) + zh * sin(lat)

  const azimuth = rev(atan2(yhor, xhor) + 180)
  const altGeo = atan2(zhor, Math.sqrt(xhor * xhor + yhor * yhor))
  // Topocentric correction for the Moon's large parallax.
  const parallax = asin(1 / r)
  const elevation = altGeo - parallax * cos(altGeo)

  // Phase / illumination.
  const elong = acos(cos(lonsun - lonecl) * cos(latecl))
  const illumination = ((1 + cos(180 - elong)) / 2) * 100
  const age = rev(lonecl - lonsun)

  return {
    elevation,
    azimuth,
    distanceKm: r * 6371,
    illumination,
    phase: phaseName(age)
  }
}
