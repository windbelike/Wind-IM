import Layout from '../components/Layout'
import { useUserInfo } from '../hooks/useUserInfo'
import '../styles/global.css'
const AV = require('leancloud-storage')

// Next.js custom app entry, this function runs before every pages's initialization.
export default function WindIMApp ({ Component, pageProps }) {
  const username = useUserInfo(null)
  console.log(AV.User.current())
  console.log('WindIMApp _app username:' + username)
  pageProps.userInfoContext = { username }

  return (
    <Layout userInfoContext={pageProps.userInfoContext}>
      <Component {...pageProps} />
    </Layout>
  )
}
