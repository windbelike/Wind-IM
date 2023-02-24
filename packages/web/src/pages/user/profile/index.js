import axios from '@/utils/axiosUtils'

async function whoami (req) {
  const data = await axios.get('/api/whoami', {
    headers: {
      Cookie: req.headers.cookie
    }
  })
  return data.data
}

export default function Profile ({ user }) {
  // const { isLoading, error, data } = useQuery('whoami', whoami)

  return (
    <>
      <p>Hello, {user.username}</p>
      {/*
      {isLoading && <p>Loading</p>}

      {data &&
      <div>
        <h1>Hello, {data.data?.email}</h1>
      </div>
      }
      {error && <p>error</p>} */}
    </>

  )
}

export async function getServerSideProps ({ req }) {
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
