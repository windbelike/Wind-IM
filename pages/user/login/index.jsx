import { useState } from 'react'
import { AiOutlinePlusCircle } from 'react-icons/ai'
const AV = require('leancloud-storage')

// Sign in or sign up
export default function SignInOrSignUp ({ username }) {
  const [usernameInput, setUsernameInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')

  return (
    <div className='flex h-full justify-center items-center'>
      <div className='flex flex-col bg-gray-100 p-8 rounded-lg'>
        {/* <h2>Hello, {username || 'Anonymous'}</h2> */}
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

function doRegisterAndLogin (usernameInput, passwordInput) {
  if (usernameInput === '' || passwordInput === '') {
    return
  }
  const user = new AV.User()
  user.setUsername(usernameInput)
  user.setPassword(passwordInput)

  // Register
  user.signUp().then((user) => {
    console.log(`Registered susscessfully: ${user.id}`)
  }).catch(e => {
    console.log(e)
  }).finally(() => {
    // Login
    AV.User.logIn(usernameInput, passwordInput).then((user) => {
      console.log(`Logined susscessfully: ${user.id}`)
      window.location.reload()
    }).catch(e => {
      console.log(e)
    })
  })
}
