import axios from '@/utils/axiosUtils'
import { useRouter } from 'next/router'
import { useMutation } from 'react-query'

const backendDomain = process.env.NEXT_PUBLIC_BACKEND_HOST

async function logout () {
  const result = await axios.post(backendDomain + '/api/logout', {
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
