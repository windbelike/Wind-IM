import envConfig from '../envConfig'
import { useEffect, useState } from 'react'
const AV = require('leancloud-storage')

let hasInitServerless = false
export function initServerless () {
  // 初始化Serverless配置
  if (hasInitServerless) {
    return
  }
  AV.init({
    appId: envConfig.appId,
    appKey: envConfig.appKey
  })
  hasInitServerless = true
}

export function useUserInfo (defaultUsername) {
  const [username, setUsername] = useState(defaultUsername)

  useEffect(() => {
    initServerless()
    const currentUser = AV.User.current()
    if (currentUser) {
      // Jump to welcome page.
      console.log(currentUser.getUsername() + ' has already logined')
      setUsername(currentUser.getUsername())
    } else {
      // Jump to login/register page.
      console.log('Not logined yet')
    }
  }, [])

  return username
}
