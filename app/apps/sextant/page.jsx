import { useMDXComponents } from '../../../mdx-components'
import { LiveSextant } from '../../sextant/live'

export const metadata = {
  title: 'Sextant',
  description:
    'Live accelerometer readings from your device, used to determine which way is down.'
}

export const dynamic = 'force-dynamic'

const Wrapper = useMDXComponents().wrapper

export default function SextantPage() {
  return (
    <Wrapper metadata={{ title: 'Sextant' }}>
      <h2>Accelerometer</h2>
      <p>
        Gravity points along the largest acceleration component. Hold the
        device still and the vector below should approximate <em>down</em>.
      </p>
      <LiveSextant />
    </Wrapper>
  )
}
