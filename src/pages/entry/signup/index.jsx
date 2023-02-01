import axios from 'axios'
import { useRef, useState } from 'react'
import { useMutation } from 'react-query'

// Custom nested route for _app.js
SignUpForm.isEntry = true

async function createAccount ({ email, pwd }) {
  await axios.post('/api/signup', {
    email, pwd
  })
}

export default function SignUpForm () {
  // useRef don't cause a rerender
  const $email = useRef()
  const $pwd = useRef()

  // prisma.user.findMany()
  const createAccountMutation = useMutation(createAccount, {
    onSuccess () {
      alert('created!')
    }
  })

  function onClickCreateAccount () {
    const email = $email.current.value
    const pwd = $pwd.current.value
    console.log('email:' + email)
    console.log('pwd:' + pwd)
    createAccountMutation.mutate({ email, pwd })
  }

  return (
    <>
      <h1>SignUp Page</h1>
      <div className='flex h-full justify-center items-center'>
        <div className='flex flex-col bg-gray-100 p-8 rounded-lg'>
          <label htmlFor="emailInput">Email: </label>
          <input ref={$email} id="emailInput" type="text" name="text"/>
          <br/>
          <label htmlFor="pwdInput">Password: </label>
          <input ref={$pwd} className='rounded-sm' id="pwdInput" type="password" name="text"/>
          <button disabled={createAccountMutation.isLoading} className='h-10 rounded-full bg-sky-500 text-white hover:bg-sky-600 mt-7 mx-5 px-5 shrink-0 focus:ring focus:ring-sky-300 active:bg-sky-700 focus:outline-none' onClick={onClickCreateAccount}>Sign Up</button>
        </div>
      </div>
    </>
  )
}
