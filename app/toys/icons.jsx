// Shared SVG icons for the Toys section.
// viewBox="0 0 100 100", fill/stroke="currentColor" → inherit colour, scale via CSS.

export function SunIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={className} aria-hidden="true">
      <circle cx="50" cy="50" r="17" fill="currentColor" />
      <line x1="50"   y1="24"   x2="50"   y2="6"    stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <line x1="68.4" y1="31.6" x2="81.1" y2="18.9" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <line x1="76"   y1="50"   x2="94"   y2="50"   stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <line x1="68.4" y1="68.4" x2="81.1" y2="81.1" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <line x1="50"   y1="76"   x2="50"   y2="94"   stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <line x1="31.6" y1="68.4" x2="18.9" y2="81.1" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <line x1="24"   y1="50"   x2="6"    y2="50"   stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
      <line x1="31.6" y1="31.6" x2="18.9" y2="18.9" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
    </svg>
  )
}

export function MoonIcon({ className }) {
  // Crescent: outer arc of lit circle (r=32, centre 50,50) minus shadow circle (r=28, centre 63,50).
  // Intersection points ≈ (65.7, 22.1) and (65.7, 77.9).
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={className} aria-hidden="true">
      <path d="M 65.7 22.1 A 32 32 0 1 0 65.7 77.9 A 28 28 0 0 1 65.7 22.1 Z" fill="currentColor" />
    </svg>
  )
}

export function TreeIcon({ className }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className={className} aria-hidden="true">
      <rect x="44" y="76" width="12" height="20" rx="2" fill="currentColor" />
      <polygon points="50,42 12,78 88,78" fill="currentColor" />
      <polygon points="50,24 20,58 80,58" fill="currentColor" />
      <polygon points="50,6  28,40 72,40" fill="currentColor" />
    </svg>
  )
}
