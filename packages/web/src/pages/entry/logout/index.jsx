import { useRouter } from 'next/router'
import { useMutation } from 'react-query'
import axios from '@/utils/axiosUtils'

async function whoami (req) {
  const data = await axios.get('/api/whoami', {
    headers: {
      Cookie: req.headers.cookie
    }
  })
  return data.data
}

async function logout () {
  const result = await axios.post('/api/logout', {
    withCredentials: true
  })
  return result.data
}

export default function LogoutForm () {
  const logoutMutation = useMutation(logout)
  const router = useRouter()
  function onClickLogout () {
    logoutMutation.mutate({})
  }

  if (logoutMutation.data?.ok) {
    console.log('onClickLogout ok' + JSON.stringify(logoutMutation.data))
    // todo clean this setTimeout
    setTimeout(() => router.push('/entry/login'), 2000)
    return (
      <>
        <div className='flex flex-col h-full w-full justify-center items-center'>
          <h1 className='text-5xl'>As you wish!</h1>
        </div>
      </>
    )
  }

  return (
    <>
      <div className='flex flex-col h-full w-full justify-center items-center'>
        <h1 className='text-5xl'>Really wanna logout?</h1>
        <button onClick={onClickLogout} className='h-12 bg-black text-white px-5 shrink-0'>Yes</button>
      </div>
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
