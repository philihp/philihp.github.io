import { useMDXComponents as getBlogMDXComponents } from 'nextra-theme-blog'
import {
  PointilleDemo,
  PointilleFigure,
  PointilleRondel
} from './components/pointille'

const blogComponents = getBlogMDXComponents({
  DateFormatter: ({ date }) =>
    date.toLocaleDateString('en', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
})

export function useMDXComponents(components) {
  return {
    ...blogComponents,
    // The theme wraps <blockquote> in a GitHub-alert detector that assumes a
    // remark-generated child shape; raw-HTML blockquotes from the imported
    // WordPress-era posts break it. None of these posts use alert syntax, so
    // fall back to a plain blockquote (still styled by the theme's CSS).
    blockquote: props => <blockquote {...props} />,
    PointilleRondel,
    PointilleFigure,
    PointilleDemo,
    ...components
  }
}
