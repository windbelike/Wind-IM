import envConfig from '../envConfig'
import { Realtime } from 'leancloud-realtime'

export function useImClient (username) {
  if (username == null) {
    return null
  }
  const realtimeConn = new Realtime({
    appId: envConfig.appId,
    appKey: envConfig.appKey
  })
  if (realtimeConn != null) {
    const imClient = realtimeConn
      .createIMClient(username)
      .then(function (cli) {
        cli.on(Event.INVITED, function invitedEventHandler (payload, conversation) {
          console.log(payload.invitedBy, conversation.id)
        })
        cli.on(Event.MESSAGE, function (message, conversation) {
          console.log('Got new msg:' + message.text)
        })
        return cli
      })
      .catch(console.error)

    return imClient
  } else {
    console.log('create realtime error')

    return null
  }
}
