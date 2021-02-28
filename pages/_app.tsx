import { BaseStyles } from '@primer/components'
import type { AppProps } from 'next/app'
import 'codemirror/theme/solarized.css'
import '../src/styles/globals.css'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()

const App = ({ Component, pageProps }: AppProps) => (
  <BaseStyles>
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  </BaseStyles>
)

export default App
