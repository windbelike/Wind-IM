import Layout from '../components/Layout'
import { useClientInfoEffect, useUserInfoEffect } from '../lib/util'
import '../styles/global.css'

// Next.js custom app entry, this function runs before every pages's initialization.
function MyApp ({ Component, pageProps }) {
  const username = useUserInfoEffect(null)
  const imClient = useClientInfoEffect(username)
  pageProps.userInfoContext = { username, imClient }
  console.log('MyApp')

  return (
    <Layout userInfoContext={pageProps.userInfoContext}>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
