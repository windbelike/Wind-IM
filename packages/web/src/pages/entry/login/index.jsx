import { useState, useRef } from 'react'
import { useMutation } from 'react-query'
import { useRouter } from 'next/router'
import axios from '@/utils/axiosUtils'
import Link from 'next/link'
import { isEmail } from '@/utils/validateUtils'

async function login ({ email, pwd }) {
  // backendDomain + '/api/login'
  const result = await axios.post('/api/login', {
    email,
    pwd
  })
  return result.data
}

export default function LoginForm () {
  const [emailIsInvalid, setEmailIsInvalid] = useState(false)
  const router = useRouter()
  const loginMutation = useMutation(login)
  const $email = useRef(null)
  const $pwd = useRef(null)

  function onClickLogin () {
    const email = $email.current.value
    const pwd = $pwd.current.value
    if (isEmail(email)) {
      console.log('email is valid')
      setEmailIsInvalid(false)
      loginMutation.mutate({ email, pwd })
    } else {
      console.log('email is invalid')
      setEmailIsInvalid(true)
    }
  }

  if (loginMutation.data?.ok) {
    // todo clear this setTimeout
    setTimeout(() => {
      router.push('/')
    }, 500)
  }

  return (
    <>
      <div className='flex h-screen w-screen justify-center items-center bg-gradient-to-r from-sky-500 to-indigo-500'>
        <div className='flex flex-col h-[432px] w-[408px] p-8 shadow-2xl rounded-md bg-[#313338]  text-white'>
          <h1 className=' text-center text-2xl'>Welcome back!</h1>
          <div className='flex flex-col pt-5'>
            <p className='text-[#b8b9bf] font-bold text-sm mt-5 mb-1'>EMAIL</p>
            <input className='bg-[#1e1f22] p-2' type="text" ref={$email}/>
            <p className='text-[#b8b9bf] font-bold text-sm mt-5 mb-1'>PASSWORD</p>
            <input className='bg-[#1e1f22] p-2' type="password" ref={$pwd}/>
            <button onClick={onClickLogin} className='h-10 rounded-md bg-[#6161f1] mt-7 shrink-0' >Log In</button>
            {emailIsInvalid && <p className='mt-2 text-red-500'>Email is invalid.</p>}
            {loginMutation.error && <p className='mt-2 text-red-500'>Failed to Login.</p>}
            {loginMutation.data?.ok && <p className='mt-2 text-green-400'>Login successfully !!! Redicting...</p>}
          </div>
          <Link href='/entry/signup'>
            <a className='mt-3 underline text-blue-400'>Need an account? Register</a>
          </Link>
        </div>
      </div>
    </>

  )
}
