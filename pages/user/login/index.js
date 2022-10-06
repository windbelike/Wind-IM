import { useState } from 'react'
import Layout from '../../../components/Layout'
import { useUserInfoEffect } from '../../../lib/util'
const AV = require('leancloud-storage')

// Login or register
export default function LoginOrRegister () {
  const defaultUsername = useUserInfoEffect()
  const [usernameInput, setUsernameInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')

  return (
    <Layout>

      <div className="p-6 max-w-sm mx-auto bg-white rounded-xl shadow-lg flex items-center space-x-4">
        <div className="shrink-0">
          <img className="h-12 w-12" src="https://avatars.githubusercontent.com/u/33996345?v=4" alt="ChitChat Logo" />
        </div>
        <div>
          <div className="text-xl font-medium text-black">ChitChat</div>
          <p className="text-slate-500">You have a new message!</p>
        </div>
      </div>

      <h1>Sign In/Sign Up</h1>
      <h2>Hello, {defaultUsername || 'Anonymous'}</h2>
      <label htmlFor="usernameInput">username: </label>
      <input id="usernameInput" type="text" name="text" onChange={(e) => setUsernameInput(e.target.value)}/>
      <br/>
      <label htmlFor="paswordInput">password: </label>
      <input id="passwordInput" type="password" name="text" onChange={(e) => setPasswordInput(e.target.value)}/>
      <input type="submit" value='Login' onClick={() => doRegisterAndLogin(usernameInput, passwordInput)}/>
    </Layout>
  )
}

function doRegisterAndLogin (usernameInput, passwordInput) {
  const user = new AV.User()
  user.setUsername(usernameInput)
  user.setPassword(passwordInput)

  // Register
  user.signUp().then((user) => {
    console.log(`Registered susscessfully: ${user.id}`)
  }, (error) => {
    console.log(error)
  })

  // Login
  AV.User.logIn(usernameInput, passwordInput).then((user) => {
    console.log(`Logined susscessfully: ${user.id}`)
  }, (error) => {
    console.log(error)
  })
}
