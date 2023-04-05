import Layout from '@/pages/Layout'
import HomeLayout from './HomeLayout'

Home.getLayout = function getLayout (page) {
  console.log('Home.getLayout')
  return (
    <Layout>
      <HomeLayout>{page}</HomeLayout>
    </Layout>
  )
}

export default function Home () {
  return (
    <>hello home</>
  )
}
