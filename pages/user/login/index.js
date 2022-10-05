import { useEffect, useState } from 'react'
import { useUserInfoEffect } from '../../../lib/util'
const AV = require('leancloud-storage')

// Login or register
export default function LoginOrRegister () {
  const defaultUsername = useUserInfoEffect()
  const [usernameInput, setUsernameInput] = useState('')
  const [passwordInput, setPasswordInput] = useState('')

  return (
    <div>
      <h1>Login/Register</h1>
      <h2>Hello, {defaultUsername || 'Anonymous'}</h2>
      <label htmlFor="usernameInput">username: </label>
      <input id="usernameInput" type="text" name="text" onChange={(e) => setUsernameInput(e.target.value)}/>
      <br/>
      <label htmlFor="paswordInput">password: </label>
      <input id="passwordInput" type="password" name="text" onChange={(e) => setPasswordInput(e.target.value)}/>
      <input type="submit" value='Login' onClick={() => doRegisterAndLogin(usernameInput, passwordInput)}/>
    </div>
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
