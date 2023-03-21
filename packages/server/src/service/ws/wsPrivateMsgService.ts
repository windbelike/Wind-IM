
import cookie from 'cookie'
import { getUserFromCookieToken } from '@/utils/authUtils'

import type { User } from '@/utils/authUtils'
import { getDestUserOfPrivateMsg, persistPrivateMsg, fetchAllMissedPrivateMsg } from '@/service/msg/msgService'
import { queryUserById } from '../user/userService'

export type SocketData = {
  user: User
  privateMsgId: any
  toUserId: any
  privateMsgOffset: any
}

// Middleware to attach msgId and user info
export async function wsAuthMiddleware (socket, next) {
  try {
    const user = await fetchUserFromSocket(socket)
    if (!user) {
      next(new Error('unknown user'))
    }
    const privateMsgId = socket.handshake.query?.privateMsgId
    const privateMsgOffset = socket.handshake.query?.privateMsgOffset ?? 0
    if (!privateMsgId) {
      next(new Error('unknown msgId'))
    }
    const toUserId = await getDestUserOfPrivateMsg(privateMsgId, user.id)
    socket.data = {
      user,
      privateMsgId,
      toUserId,
      privateMsgOffset
    }
    next()
  } catch (e) {
    next(new Error('unknown user'))
  }
}

export async function wsOnConnect (socket) {
  const privateMsgId = socket.data?.privateMsgId
  const user = socket.data?.user
  const toUid = socket.data?.toUserId
  const privateMsgOffset = socket.data?.privateMsgOffset
  const email = user?.email
  console.log(`email:"${email}" connected with privateMsgId:${privateMsgId}`)
  const privateMsgEvent = 'privateMsgEvent_' + privateMsgId

  socket.on('disconnect', (reason) => {
    console.log(email + ' disconnected. for reason:' + reason)
  })
  if (privateMsgId) {
    // asynchronously send all missed private msg by offset
    sendAllMissedMsg(socket, privateMsgId, privateMsgOffset)

    socket.on(privateMsgEvent, async (msg, ackFn) => {
      // todo save msg to db
      const msgModel = await persistPrivateMsg(parseInt(privateMsgId), user.id, toUid, msg.content)
      // const senderUsername = await queryUserById(msgModel.fromUid)
      const msg2Send = {
        content: msgModel.content,
        senderUsername: msgModel.fromUidRel.username,
        id: msgModel.id
      }
      // ...
      // simulate server timeout, and ack to client
      // setTimeout(() => ackFn({ code: 0 }), 1000)
      ackFn({ code: 0 })

      // broadcast: exclude the sender ws
      socket.broadcast.emit(privateMsgEvent, msg2Send)
    })
  }
}

async function fetchUserFromSocket (socket) {
  let cookies
  try {
    cookies = cookie.parse(socket.handshake.headers.cookie)
  } catch (e) {
    console.error(e)
  }
  const user = await getUserFromCookieToken(cookies?.token)
  return user
}

async function sendAllMissedMsg (socket, privateMsgId, offset) {
  const privateMsgInitEvent = 'privateMsgInitEvent_' + privateMsgId
  const allMissedMsg = await fetchAllMissedPrivateMsg(parseInt(privateMsgId), parseInt(offset))
  const allMissedMsgVO = allMissedMsg.map(m => {
    const msg2Send = {
      id: m.id,
      content: m.content,
      senderUsername: m.fromUidRel.username,
      sendByMyself: socket.data?.user?.id == m.fromUid
    }
    return msg2Send
  })

  socket.emit(privateMsgInitEvent, allMissedMsgVO)
}
