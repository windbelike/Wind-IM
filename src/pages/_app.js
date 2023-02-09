import 'styles/global.css'
import { QueryClientProvider, QueryClient } from 'react-query'
import Layout from './Layout'

const queryClient = new QueryClient()

// Next.js custom app entry, this function runs before every pages's initialization.
// https://nextjs.org/docs/basic-features/layouts
export default function WindIM ({ Component, pageProps }) {
  if (Component.isEntry) {
    return (
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    )
  }

  return (
    <Layout userInfoContext={pageProps.userInfoContext}>
      <QueryClientProvider client={queryClient}>
        <Component {...pageProps} />
      </QueryClientProvider>
    </Layout>
  )
}
