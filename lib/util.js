import envConfig from '../envConfig'
import { useEffect, useState } from 'react'
const AV = require('leancloud-storage')

export function initServerless () {
  // 初始化Serverless配置
  AV.init({
    appId: envConfig.appId,
    appKey: envConfig.appKey
  })
}

export function useUserInfoEffect (defaultUsername) {
  const [username, setUsername] = useState(defaultUsername)

  useEffect(() => {
    initServerless()
    // Get current user.
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
