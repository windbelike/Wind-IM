import { useState, useRef } from 'react'
import axios from 'axios'
import { useMutation } from 'react-query'
import { useRouter } from 'next/router'

async function login ({ email, pwd }) {
  const result = await axios.post('/api/login', {
    email,
    pwd
  })
  return result.data
}

export default function LoginForm () {
  const router = useRouter()
  const loginMutation = useMutation(login)
  const $email = useRef(null)
  const $pwd = useRef(null)

  function onClickLogin () {
    const email = $email.current.value
    const pwd = $pwd.current.value
    loginMutation.mutate({ email, pwd })
  }

  if (loginMutation.data?.ok) {
    setTimeout(() => {
      router.push('/user/profile')
    }, 2000)
    return (<>Login successfully !!! Redicting...</>)
  }

  return (
    <div className='flex h-full justify-center items-center'>
      <div className='flex flex-col bg-gray-100 p-8 rounded-lg'>
        {loginMutation.error && <div style={{ color: 'red' }}>{loginMutation.error.response.data.message}</div>}
        <label>Email: </label>
        <input type="text" autoComplete="on" ref={$email}/>
        <br/>
        <label >Password: </label>
        <input className='rounded-sm' type="password" ref={$pwd}/>
        <button onClick={onClickLogin} className='h-12 rounded-full bg-sky-500 text-white hover:bg-sky-600 m-5 px-5 shrink-0 focus:ring focus:ring-sky-300 active:bg-sky-700 focus:outline-none' >Login</button>
        <div>{JSON.stringify(loginMutation) }</div>
      </div>
    </div>
  )
}

LoginForm.isEntry = true
