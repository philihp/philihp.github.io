const RAD = Math.PI / 180

// Atmospheric refraction (deg) to add to a geometric solar elevation to get the
// apparent (observed) elevation. The atmosphere bends sunlight upward, most
// strongly near the horizon (~0.5°), so the sun stays visible until its
// geometric centre is roughly 0.83° below the horizon. Same piecewise fit as
// the NOAA Solar Calculator.
const refractionCorrection = elevation => {
  if (elevation > 85) return 0
  const te = Math.tan(elevation * RAD)
  let seconds
  if (elevation > 5) {
    seconds = 58.1 / te - 0.07 / te ** 3 + 0.000086 / te ** 5
  } else if (elevation > -0.575) {
    seconds =
      1735 +
      elevation *
        (-518.2 + elevation * (103.4 + elevation * (-12.79 + elevation * 0.711)))
  } else {
    seconds = -20.772 / te
  }
  return seconds / 3600 // arc-seconds to degrees
}

// NOAA solar position algorithm.
// Ports the equations from the NOAA Solar Calculator spreadsheet.
export const solarPosition = (date, lat, lon) => {
  const jd = date.getTime() / 86400000 + 2440587.5
  const T = (jd - 2451545.0) / 36525.0 // Julian centuries since J2000.0

  const L0 = (((280.46646 + T * (36000.76983 + T * 0.0003032)) % 360) + 360) % 360
  const M = 357.52911 + T * (35999.05029 - 0.0001537 * T)
  const e = 0.016708634 - T * (0.000042037 + 0.0000001267 * T)

  const C =
    Math.sin(M * RAD) * (1.914602 - T * (0.004817 + 0.000014 * T)) +
    Math.sin(2 * M * RAD) * (0.019993 - 0.000101 * T) +
    Math.sin(3 * M * RAD) * 0.000289

  const trueLong = L0 + C
  const omega = 125.04 - 1934.136 * T
  const lambda = trueLong - 0.00569 - 0.00478 * Math.sin(omega * RAD)

  const seconds = 21.448 - T * (46.815 + T * (0.00059 - T * 0.001813))
  const e0 = 23 + (26 + seconds / 60) / 60
  const obliquity = e0 + 0.00256 * Math.cos(omega * RAD)

  const declination =
    Math.asin(Math.sin(obliquity * RAD) * Math.sin(lambda * RAD)) / RAD

  // Equation of time (minutes)
  const y = Math.tan((obliquity / 2) * RAD) ** 2
  const eqTime =
    (4 *
      (y * Math.sin(2 * L0 * RAD) -
        2 * e * Math.sin(M * RAD) +
        4 * e * y * Math.sin(M * RAD) * Math.cos(2 * L0 * RAD) -
        0.5 * y * y * Math.sin(4 * L0 * RAD) -
        1.25 * e * e * Math.sin(2 * M * RAD))) /
    RAD

  const utcMinutes =
    date.getUTCHours() * 60 +
    date.getUTCMinutes() +
    date.getUTCSeconds() / 60 +
    date.getUTCMilliseconds() / 60000

  const trueSolarTime = (((utcMinutes + eqTime + 4 * lon) % 1440) + 1440) % 1440
  let hourAngle = trueSolarTime / 4 - 180
  if (hourAngle < -180) hourAngle += 360

  const latRad = lat * RAD
  const declRad = declination * RAD
  const haRad = hourAngle * RAD

  const cosZenith =
    Math.sin(latRad) * Math.sin(declRad) +
    Math.cos(latRad) * Math.cos(declRad) * Math.cos(haRad)
  const zenith = Math.acos(Math.min(1, Math.max(-1, cosZenith))) / RAD

  // The sun's apparent angular radius (semidiameter). Its distance varies over
  // the year, so this does too: NOAA's radius vector R (in AU) from the true
  // anomaly, then the mean semidiameter of 959.63" scaled by 1/R.
  const trueAnomaly = M + C
  const R = (1.000001018 * (1 - e * e)) / (1 + e * Math.cos(trueAnomaly * RAD))
  const semidiameter = 959.63 / 3600 / R // degrees

  // Report the apparent elevation of the sun's *upper limb*: the geometric
  // angle of the centre, lifted by atmospheric refraction, plus one angular
  // radius. Sunrise and sunset are defined as the upper limb touching the
  // horizon, so this reads exactly 0° at those moments.
  const geometricElevation = 90 - zenith
  const elevation =
    geometricElevation +
    refractionCorrection(geometricElevation) +
    semidiameter

  const cosAz =
    (Math.sin(latRad) * Math.cos(zenith * RAD) - Math.sin(declRad)) /
    (Math.cos(latRad) * Math.sin(zenith * RAD))
  const az = Math.acos(Math.min(1, Math.max(-1, cosAz))) / RAD
  const azimuth = hourAngle > 0 ? (az + 180) % 360 : (540 - az) % 360

  return { declination, elevation, azimuth }
}

// Fixed "en-US" locale so server and client format identically (no hydration
// mismatch when these values are rendered live in the browser).
export const fmt = (n, digits = 4) =>
  n.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits
  })

export const compass = azimuth => {
  const dirs = [
    'N',
    'NNE',
    'NE',
    'ENE',
    'E',
    'ESE',
    'SE',
    'SSE',
    'S',
    'SSW',
    'SW',
    'WSW',
    'W',
    'WNW',
    'NW',
    'NNW'
  ]
  return dirs[Math.round(azimuth / 22.5) % 16]
}
