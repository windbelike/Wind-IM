import 'styles/global.css'
import { QueryClientProvider, QueryClient } from 'react-query'
import { useEffect } from 'react'
import { onlineHeartbeat } from '@/utils/apiUtils'

const queryClient = new QueryClient()

// Next.js custom app entry, this function runs before every pages's initialization.
export default function WindIM ({ Component, pageProps }) {
  // reference: per-page layouts(https://nextjs.org/docs/basic-features/layouts)
  const getLayout = Component.getLayout || ((page) => page)

  // online hear beat, every 5 seconds
  useOnlineHeartbeat(5)

  return (
    <QueryClientProvider client={queryClient}>
      {getLayout(<Component {...pageProps} />)}
    </QueryClientProvider>
  )
}

function useOnlineHeartbeat (second) {
  useEffect(() => {
    onlineHeartbeat()
    const interval = setInterval(() => {
      onlineHeartbeat()
    }, 1000 * second)
    return () => clearInterval(interval)
  }, [])
}
