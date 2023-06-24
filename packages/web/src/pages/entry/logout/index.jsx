import { useRouter } from 'next/router'
import { useMutation } from 'react-query'
import axios from '@/utils/axiosUtils'
import Layout from '@/pages/Layout'

async function logout () {
  const result = await axios.post('/api/logout', {
    withCredentials: true
  })
  return result.data
}

LogoutForm.getLayout = function getLayout (page) {
  console.log('Home.getLayout')
  return (
    <Layout>
      {page}
    </Layout>
  )
}

export default function LogoutForm () {
  console.log('logout form')
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
        <h1 className='text-5xl text-white'>Really wanna logout?</h1>
        <button onClick={onClickLogout} className='h-12 bg-black text-white px-5 shrink-0'>Yes</button>
      </div>
    </>
  )
}
