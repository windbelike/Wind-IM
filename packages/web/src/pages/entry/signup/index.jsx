import { isEmail } from '@/utils/validateUtils'
import axios from 'axios'
import Link from 'next/link'
import { useRef, useState } from 'react'
import { useMutation } from 'react-query'

async function createAccount ({ email, username, pwd }) {
  await axios.post('/api/signup', {
    email, username, pwd
  })
}

export default function SignUpForm () {
  const [emailIsInvalid, setEmailIsInvalid] = useState(false)
  // useRef don't cause a rerender
  const $email = useRef()
  const $username = useRef()
  const $pwd = useRef()

  // prisma.user.findMany()
  const createAccountMutation = useMutation(createAccount, {
    onSuccess () {
      alert('created!')
    }
  })

  function onClickCreateAccount () {
    const email = $email.current.value
    const username = $username.current.value
    const pwd = $pwd.current.value
    console.log('email:' + email)
    console.log('username:' + username)
    if (isEmail(email)) {
      console.log('email is valid')
      createAccountMutation.mutate({ email, username, pwd })
      setEmailIsInvalid(false)
    } else {
      console.log('email is invalid')
      setEmailIsInvalid(true)
    }
  }

  return (
    <>
      <div className='flex h-screen w-screen justify-center items-center bg-gradient-to-r from-sky-500 to-indigo-500'>
        <div className='flex flex-col h-[502px] w-[408px] p-8 shadow-2xl rounded-md bg-[#313338]  text-white'>
          <h1 className=' text-center text-2xl'>Create an account</h1>
          <div className='flex flex-col pt-5'>
            <p className='text-[#b8b9bf] font-bold text-sm mt-5 mb-1'>EMAIL</p>
            <input className='bg-[#1e1f22] p-2' ref={$email} type="text"/>
            <p className='text-[#b8b9bf] font-bold text-sm mt-5 mb-1'>USERNAME</p>
            <input className='bg-[#1e1f22] p-2' ref={$username} type="text"/>
            <p className='text-[#b8b9bf] font-bold text-sm mt-5 mb-1'>PASSWORD</p>
            <input className='bg-[#1e1f22] p-2' ref={$pwd} type="password"/>
          </div>
          <button disabled={createAccountMutation.isLoading} className='h-10 rounded-md bg-[#6161f1] mt-7 shrink-0' onClick={onClickCreateAccount}>Sign Up</button>
          {emailIsInvalid && <p className='mt-2 text-red-500'>Invalid email.</p>}
          {createAccountMutation.error && <p className='mt-2 text-red-500'>Invalid input.</p>}
          <Link href='/entry/login'>
            <a className='mt-3 underline text-blue-400'>Already have an account?</a>
          </Link>
        </div>
      </div>
    </>
  )
}
