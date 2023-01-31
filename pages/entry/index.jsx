import { useState, useRef } from 'react'
import axios from 'axios'
import { useMutation } from 'react-query'

export default function index () {
  const [loginSwitch, setLoginSiwtch] = useState(true) // 默认登录界面
  return (
    <>
      <button onClick={() => setLoginSiwtch(!loginSwitch)}>
        {loginSwitch && 'SignUp'}
        {!loginSwitch && 'Login'}
      </button>
      {loginSwitch && <LoginForm/>}
      {!loginSwitch && <SignUpForm/>}
    </>
  )
}

async function login ({ email, pwd }) {
  const result = await axios.post('/api/login', {
    email,
    pwd
  })
  return result.data
}

async function createAccount ({ email, pwd }) {
  await axios.post('/api/signup', {
    email, pwd
  })
}
function SignUpForm () {
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

function LoginForm () {
  const loginMutation = useMutation(login)
  const $email = useRef(null)
  const $pwd = useRef(null)

  function onClickLogin () {
    const email = $email.current.value
    const pwd = $pwd.current.value
    loginMutation.mutate({ email, pwd })
  }

  return (
    <div className='flex h-full justify-center items-center'>
      <div className='flex flex-col bg-gray-100 p-8 rounded-lg'>
        {loginMutation.error && <div style={{ color: 'red' }}>{loginMutation.error.response.data.message}</div>}
        <label>Username: </label>
        <input type="text" ref={$email}/>
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
SignUpForm.isEntry = true
