import axios from '@/utils/axiosUtils'
import Avatar from '@/components/Avatar'
import Layout from '@/pages/Layout'

Profile.getLayout = function getLayout (page) {
  console.log('Home.getLayout')
  return (
    <Layout>
      {page}
    </Layout>
  )
}

export default function Profile ({ user }) {
  // const { isLoading, error, data } = useQuery('whoami', whoami)

  // todo
  // hash取颜色
  // 取username首字符
  return (
    <>
      <p>Hello, {user.username}</p>
      <Avatar username={user.username} />
    </>

  )
}

export async function getServerSideProps ({ req }) {
  async function whoami (req) {
    const data = await axios.get('/api/whoami', {
      headers: {
        Cookie: req.headers.cookie
      }
    })
    return data.data
  }

  let data
  try {
    data = await whoami(req)
  } catch (e) {
    console.log('#getServerSideProps error')
  }

  if (data?.code != 0) {
    return {
      redirect: {
        permanent: false,
        destination: '/entry'
      }
    }
  }
  return {
    props: {
      user: data.data
    }
  }
}
