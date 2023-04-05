import 'styles/global.css'
import { QueryClientProvider, QueryClient } from 'react-query'

const queryClient = new QueryClient()

// Next.js custom app entry, this function runs before every pages's initialization.
// https://nextjs.org/docs/basic-features/layouts
export default function WindIM ({ Component, pageProps }) {
  // entry layout, to be refactored by per-page layouts as below
  // if (Component.isEntry) {
  //   return (
  //     <QueryClientProvider client={queryClient}>
  //       <Component {...pageProps} />
  //     </QueryClientProvider>
  //   )
  // }

  // reference: per-page layouts(https://nextjs.org/docs/basic-features/layouts)
  const getLayout = Component.getLayout || ((page) => page)

  return (
    <QueryClientProvider client={queryClient}>
      {getLayout(<Component {...pageProps} />)}
    </QueryClientProvider>
  )
}
