
import cookie from 'cookie'
import { getUserFromCookieToken } from '@/utils/authUtils'

import type { User } from '@/utils/authUtils'
import { getDestUserOfPrivateMsg, persistPrivateMsg, fetchAllMissedPrivateMsg } from '@/service/msg/msgService'
import { fetchAllMissedRoomMsg, persistRoomMsg } from '@/service/room/roomService'

// Websocket Message Service

export type SocketData = {
  user: User
  privateMsgId: any
  toUserId: any
  privateMsgOffset: any
}

// private msg format
function buildPrivateMsgEvent (privateMsgId) {
  return 'privateMsgEvent_' + privateMsgId
}

// init private msg event
export function buildInitPrivateMsgEvent (privateMsgId) {
  return 'privateMsgInitEvent_' + privateMsgId
}

// room msg format
function buildRoomMsgEvent (roomId) {
  return 'roomMsgEvent_' + roomId
}

// init room msg event
export function buildInitRoomMsgEvent (roomId) {
  return 'roomMsgInitEvent_' + roomId
}

// Middleware to attach msgId and user info
export async function wsAuthMiddleware (socket, next) {
  try {
    const user = await fetchUserFromSocket(socket)
    if (!user) {
      next(new Error('unknown user'))
    }
    const roomId = socket.handshake.query?.roomId
    const privateMsgId = socket.handshake.query?.privateMsgId
    const privateMsgOffset = socket.handshake.query?.privateMsgOffset ?? 0
    const roomMsgOffset = socket.handshake.query?.roomMsgOffset ?? 0
    if (!privateMsgId && !roomId) {
      next(new Error('unknown msgId'))
    }
    const toUserId = await getDestUserOfPrivateMsg(privateMsgId, user.id)
    socket.data = {
      user,
      privateMsgId,
      toUserId,
      privateMsgOffset,
      roomMsgOffset,
      roomId
    }
    next()
  } catch (e) {
    next(new Error('unknown user'))
  }
}

export async function wsOnConnect (socket) {
  const roomId = socket.data?.roomId
  const privateMsgId = socket.data?.privateMsgId
  const user = socket.data?.user
  const toUid = socket.data?.toUserId
  const privateMsgOffset = socket.data?.privateMsgOffset
  const roomMsgOffset = socket.data?.roomMsgOffset
  const email = user?.email
  console.log(`email:"${email}" connected with privateMsgId:${privateMsgId} roomId:${roomId}`)
  const privateMsgEvent = buildPrivateMsgEvent(privateMsgId)
  const roomMsgEvent = buildRoomMsgEvent(roomId)

  socket.on('disconnect', (reason) => {
    console.log(email + ' disconnected. for reason:' + reason)
  })
  // if it's private msg, then send all missed direct msg
  if (privateMsgId) {
    // asynchronously send all missed direct msg by offset
    sendAllMissedPrivateMsg(socket, privateMsgId, privateMsgOffset)
    // handle receiving new private msg
    socket.on(privateMsgEvent, async (msg, ackFn) => {
      const msgModel = await persistPrivateMsg(parseInt(privateMsgId), user.id, toUid, msg.content)
      // const senderUsername = await queryUserById(msgModel.fromUid)
      const msg2Send = {
        content: msgModel.content,
        senderUsername: msgModel.fromUidRel.username,
        createdAt: msgModel.createdAt,
        id: msgModel.id
      }
      // simulate server timeout, and ack to client
      // setTimeout(() => ackFn({ code: 0 }), 1000)
      ackFn({ code: 0, sentMsg: msg2Send })

      // broadcast: exclude the sender ws
      socket.broadcast.emit(privateMsgEvent, msg2Send)
    })
  } else if (roomId) {
    // asynchronously send all missed room msg by offset
    sendAllMissedRoomMsg(socket, roomId, roomMsgOffset)
    // handle receiving new room msg
    socket.on(roomMsgEvent, async (msg, ackFn) => {
      const msgModel = await persistRoomMsg(parseInt(roomId), user.id, msg.content)
      const msg2Send = {
        content: msgModel.content,
        senderUsername: msgModel.fromUidRel.username,
        createdAt: msgModel.createdAt,
        id: msgModel.id
      }
      console.log('on receive room msg:' + JSON.stringify(msg2Send))
      // simulate server timeout, and ack to client
      // setTimeout(() => ackFn({ code: 0 }), 1000)
      ackFn({ code: 0, sentMsg: msg2Send })

      // broadcast: exclude the sender ws
      socket.broadcast.emit(roomMsgEvent, msg2Send)
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

async function sendAllMissedPrivateMsg (socket, privateMsgId, offset) {
  if (!offset) {
    offset = 0
  }
  const privateMsgInitEvent = buildInitPrivateMsgEvent(privateMsgId)
  const allMissedMsg = await fetchAllMissedPrivateMsg(parseInt(privateMsgId), parseInt(offset))
  if (!allMissedMsg) {
    return
  }
  const allMissedMsgVO = allMissedMsg.map(m => {
    const msg2Send = {
      id: m.id,
      content: m.content,
      senderUsername: m.fromUidRel.username,
      createdAt: m.createdAt
    }
    return msg2Send
  })

  socket.emit(privateMsgInitEvent, allMissedMsgVO)
}

async function sendAllMissedRoomMsg (socket, roomId, offset) {
  if (!offset) {
    offset = 0
  }
  const privateMsgInitEvent = buildInitRoomMsgEvent(roomId)
  const allMissedMsg = await fetchAllMissedRoomMsg(parseInt(roomId), parseInt(offset))
  if (!allMissedMsg) {
    return
  }
  const allMissedMsgVO = allMissedMsg.map(m => {
    const msg2Send = {
      id: m.id,
      content: m.content,
      senderUsername: m.fromUidRel.username,
      createdAt: m.createdAt
    }
    return msg2Send
  })

  socket.emit(privateMsgInitEvent, allMissedMsgVO)
}
