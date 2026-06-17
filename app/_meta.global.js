// Only these top-level items appear in the navbar. Every year folder
// (2004, 2005, …) is intentionally left out so it stays out of the nav.
export default {
  index: {
    type: 'page',
    title: 'Blog',
    href: '/'
  },
  about: {
    type: 'page',
    title: 'About'
  },
  pgp: {
    type: 'page',
    title: 'PGP'
  },
  lightning: {
    type: 'page',
    title: 'Lightning'
  },
  toys: {
    type: 'menu',
    title: 'Apps',
    items: {
      overview: { title: 'Overview', href: '/toys' },
      sun: { title: 'Sun', href: '/toys/sun' },
      moon: { title: 'Moon', href: '/toys/moon' },
      trees: { title: 'Trees', href: '/toys/trees' }
    }
  }
}
