import Link from 'next/link'
import { useMDXComponents } from '../../mdx-components'
import { SunIcon, MoonIcon, TreeIcon } from './icons'

export const metadata = {
  title: 'Apps',
  description: 'Interactive tools: live sun & moon position and nearby trees.'
}

const Wrapper = useMDXComponents().wrapper

const TOYS = [
  { href: '/toys/sun',   label: 'Sun',   Icon: SunIcon  },
  { href: '/toys/moon',  label: 'Moon',  Icon: MoonIcon },
  { href: '/toys/trees', label: 'Trees', Icon: TreeIcon  },
]

export default function ToysPage() {
  return (
    <Wrapper metadata={{ title: 'Apps' }}>
      <div className="toys-grid">
        {TOYS.map(({ href, label, Icon }) => (
          <Link key={href} href={href} className="toy-card-link">
            <Icon className="toy-card-icon" />
            <span className="toy-card-label">{label}</span>
          </Link>
        ))}
      </div>
    </Wrapper>
  )
}
