import { useState } from 'react'

// Sign in or sign up
export default function Login ({ username }) {
  const [usernameInput, setUsernameInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')

  // todo If signed in already, show the sign out layout.
  // todo If sign in or sign up successfully, jump to home.
  return (
    <div className='flex h-full justify-center items-center'>
      <div className='flex flex-col bg-gray-100 p-8 rounded-lg'>
        <h2>Hello, {username || 'Anonymous'}</h2>
        <label htmlFor="usernameInput">Username: </label>
        <input id="usernameInput" type="text" name="text" onChange={(e) => setUsernameInput(e.target.value)}/>
        <br/>
        <label htmlFor="paswordInput">Password: </label>
        <input className='rounded-sm' id="passwordInput" type="password" name="text" onChange={(e) => setPasswordInput(e.target.value)}/>
        <button className='h-12 rounded-full bg-sky-500 text-white hover:bg-sky-600 m-5 px-5 shrink-0 focus:ring focus:ring-sky-300 active:bg-sky-700 focus:outline-none' onClick={() => doRegisterAndLogin(usernameInput, passwordInput)}>Sign In or Sign Up</button>
      </div>
    </div>
  )
}

Login.isEntry = true

function doRegisterAndLogin (usernameInput, passwordInput) {

  // Register
}
