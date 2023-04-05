import HomeLayout from './home/HomeLayout'
import Home from './home/index'
import Layout from './Layout'

export default function App () {
  return (
    <>

    </>
  )
}

App.getLayout = function getLayout (page) {
  console.log('Home.getLayout')
  return (
    <Layout>
      <HomeLayout>{page}</HomeLayout>
    </Layout>
  )
}
