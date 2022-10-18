import envConfig from '../envConfig'
import { useEffect, useState } from 'react'
import { Realtime } from 'leancloud-realtime'
const AV = require('leancloud-storage')

export function initServerless () {
  // 初始化Serverless配置
  AV.init({
    appId: envConfig.appId,
    appKey: envConfig.appKey
  })
}

export function useClientInfoEffect (username) {
  const [imClient, setImClient] = useState(null)
  useEffect(() => {
    if (username == null) {
      console.error('#userClientInfoEffect empty username error.')
      return
    }
    if (imClient == null) {
      const realtimeConn = new Realtime({
        appId: envConfig.appId,
        appKey: envConfig.appKey
      })
      console.log('reantimeConn:' + realtimeConn)
      if (realtimeConn != null) {
        const client = realtimeConn
          .createIMClient(username)
          .then(function (cli) {
            console.log(username + ' logined.')
            setImClient(cli)
            return cli
          })
          .catch(console.error)
      } else {
        console.log('create realtime error')
      }
    }
  }, [username])
  return imClient
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
