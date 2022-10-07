import Layout from '../components/Layout'
import { useUserInfoEffect } from '../lib/util'
import '../styles/global.css'

// Next.js custom app entry, this function runs before every pages's initialization.
function MyApp ({ Component, pageProps }) {
  const username = useUserInfoEffect(null)
  pageProps.username = username
  console.log('MyApp')

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
