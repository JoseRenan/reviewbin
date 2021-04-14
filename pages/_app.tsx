import { BaseStyles } from '@primer/components'
import Router from 'next/router'
import type { AppProps } from 'next/app'
import 'codemirror/theme/solarized.css'
import '../src/styles/globals.css'
import 'nprogress/nprogress.css'
import { QueryClient, QueryClientProvider } from 'react-query'
import NProgress from 'nprogress'

NProgress.configure({
  minimum: 0.3,
  easing: 'ease',
  speed: 800,
  showSpinner: false,
})

Router.events.on('routeChangeStart', (url) => {
  console.log(`Loading: ${url}`)
  NProgress.start()
})
Router.events.on('routeChangeComplete', () => NProgress.done())
Router.events.on('routeChangeError', () => NProgress.done())

export const queryClient = new QueryClient()

const App = ({ Component, pageProps }: AppProps) => (
  <BaseStyles>
    <QueryClientProvider client={queryClient}>
      <Component {...pageProps} />
    </QueryClientProvider>
  </BaseStyles>
)

export default App
