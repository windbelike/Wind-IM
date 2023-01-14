import Layout from '../components/Layout'
import { useUserInfo } from '../hooks/useUserInfo'
import { useImClient } from '../hooks/useImClient'
import '../styles/global.css'

// Next.js custom app entry, this function runs before every pages's initialization.
export default function WindIMApp ({ Component, pageProps }) {
  const username = useUserInfo(null)
  console.log('WindIMApp _app username:' + username)
  const imClient = useImClient(username)
  pageProps.userInfoContext = { username, imClient }

  return (
    <Layout userInfoContext={pageProps.userInfoContext}>
      <Component {...pageProps} />
    </Layout>
  )
}
