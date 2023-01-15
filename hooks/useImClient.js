import envConfig from '../envConfig'
import { useEffect, useState } from 'react'
import { Realtime } from 'leancloud-realtime'

export function useImClient (username) {
  const [imClient, setImClient] = useState(null)
  useEffect(() => {
    if (username == null) {
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
            // Bind clint for handling conversation events
            cli.on(Event.INVITED, function invitedEventHandler (payload, conversation) {
              console.log(payload.invitedBy, conversation.id)
            })
            cli.on(Event.MESSAGE, function (message, conversation) {
              console.log('Got new msg:' + message.text)
            })
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
