import Layout from '../components/Layout'
import { useUserInfoEffect } from '../lib/util'
import '../styles/global.css'

function MyApp ({ Component, pageProps }) {
  const username = useUserInfoEffect(null)
  pageProps.username = username
  // console.log('MyApp')

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  )
}

export default MyApp
