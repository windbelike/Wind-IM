import Layout from '../src/components/Layout'
import { useUserInfo } from '../src/hooks/useUserInfo'
import '../styles/global.css'
import { QueryClientProvider, QueryClient } from 'react-query'

const queryClient = new QueryClient()
// Next.js custom app entry, this function runs before every pages's initialization.
export default function WindIMApp ({ Component, pageProps }) {
  const username = useUserInfo(null)
  console.log('WindIMApp _app username:' + username)
  pageProps.userInfoContext = { username }

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
