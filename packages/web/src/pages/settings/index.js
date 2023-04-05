import Layout from '../Layout'

export default function Settings () {
  return (
    <h1>Settings Page.</h1>
  )
}

Settings.getLayout = function getLayout (page) {
  console.log('Home.getLayout')
  return (
    <Layout>
      {page}
    </Layout>
  )
}
