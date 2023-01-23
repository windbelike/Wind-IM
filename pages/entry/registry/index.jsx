import { useState } from 'react'
const AV = require('leancloud-storage')

export default function SignUp () {
  const [email, setEmail] = useState('')
  const [pwd, setPwd] = useState('')

  return (
    <>
      <div>
        <h1>SignUp Page</h1>
      </div>
      <div className='flex h-full justify-center items-center'>
        <div className='flex flex-col bg-gray-100 p-8 rounded-lg'>
          <label htmlFor="emailInput">Email: </label>
          <input id="emailInput" type="text" name="text" onChange={(e) => setEmail(e.target.value)}/>
          <br/>
          <label htmlFor="pwdInput">Password: </label>
          <input className='rounded-sm' id="pwdInput" type="password" name="text" onChange={(e) => setPwd(e.target.value)}/>
          <button className='h-10 rounded-full bg-sky-500 text-white hover:bg-sky-600 mt-7 mx-5 px-5 shrink-0 focus:ring focus:ring-sky-300 active:bg-sky-700 focus:outline-none' onClick={() => doSignUp(email, pwd)}>Sign Up</button>
        </div>
      </div>
    </>
  )
}

SignUp.isEntry = true

function doSignUp (email, pwd) {
  console.log('doSignUp')
}
