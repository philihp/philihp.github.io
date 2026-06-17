'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SunIcon, MoonIcon, TreeIcon } from './icons'

const TOYS = [
  { href: '/apps/sun',   label: 'Sun',   Icon: SunIcon  },
  { href: '/apps/moon',  label: 'Moon',  Icon: MoonIcon },
  { href: '/apps/trees', label: 'Trees', Icon: TreeIcon  },
]

export default function ToyNav() {
  const pathname = usePathname()
  return (
    <nav className="toy-nav" aria-label="Apps">
      {TOYS.map(({ href, label, Icon }) => (
        <Link
          key={href}
          href={href}
          className="toy-nav-link"
          aria-current={pathname === href ? 'page' : undefined}
        >
          <Icon className="toy-nav-icon" />
          {label}
        </Link>
      ))}
    </nav>
  )
}
