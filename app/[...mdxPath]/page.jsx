import { generateStaticParamsFor, importPage } from 'nextra/pages'
import { useMDXComponents as getMDXComponents } from '../../mdx-components'
import { documentUri } from '../standard-site.js'

export const generateStaticParams = generateStaticParamsFor('mdxPath')

export async function generateMetadata(props) {
  const params = await props.params
  const { metadata } = await importPage(params.mdxPath)
  return metadata
}

const Wrapper = getMDXComponents().wrapper

export default async function Page(props) {
  const params = await props.params
  const {
    default: MDXContent,
    toc,
    metadata,
    sourceCode
  } = await importPage(params.mdxPath)

  // Only posts get a site.standard.document record; the standalone pages
  // (/about, /pgp, /lightning) carry no date and are not part of the
  // publication. See scripts/sync-documents.mjs, which mints the same rkeys.
  const route = `/${(params.mdxPath || []).join('/')}`

  return (
    <Wrapper toc={toc} metadata={metadata} sourceCode={sourceCode}>
      {metadata.date && (
        <link rel="site.standard.document" href={documentUri(route)} />
      )}
      <MDXContent {...props} params={params} />
    </Wrapper>
  )
}
