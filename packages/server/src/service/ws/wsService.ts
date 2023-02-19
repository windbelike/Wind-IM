import { Server } from 'socket.io'

import express from 'express'
import dotenv from 'dotenv'
import http from 'http'
import cookie from 'cookie'
import jwt from 'jsonwebtoken'
import { prisma } from '@/utils/prismaHolder'
import { getUserFromCookieToken } from '@/utils/authUtils'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import type { User } from '@/utils/authUtils'

type SocketData = {
  user: User;
  msgId: string | string[];
}

dotenv.config()

const app = express()
const server = http.createServer(app)

app.get('/', (req, res) => {
  res.send('Hello ws')
})

const io = new Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketData>(server,
  {
    cors: {
      origin: 'http://localhost:3000'
    }
  }
)

// Middleware to attach msgId and user info
io.use(async (socket, next) => {
  try {
    const user = await fetchUserFromSocket(socket)
    if (!user) {
      next(new Error('unknown user'))
    }
    const msgId = socket.handshake.query?.privateMsgId
    socket.data = {
      user,
      msgId
    }
    next()
  } catch (e) {
    next(new Error('unknown user'))
  }
})

async function fetchUserFromSocket (socket) {
  let cookies
  try {
    cookies = cookie.parse(socket.handshake.headers.cookie)
  } catch (e) {
    console.error(e)
  }
  console.log(JSON.stringify(socket.handshake.query))
  const user = await getUserFromCookieToken(cookies?.token)
  return user
}

io.on('connection', async (socket) => {
  const msgId = socket.data?.msgId
  const user = socket.data?.user
  const email = user?.email
  console.log(`email:"${email}" connected with msgId:${msgId}`)

  socket.on('disconnect', (reason) => {
    console.log(email + ' disconnected. for reason:' + reason)
  })
  if (msgId) {
    const privateMsgEvent = 'privateMsgEvent_' + msgId
    socket.on(privateMsgEvent, async (msg, ackFn) => {
      // todo save msg to db
      // const user = getUserFromCookieToken()
      // prisma
      // ...
      // simulate server timeout, and ack to client
      // setTimeout(() => ackFn({ code: 0 }), 1000)
      ackFn({ code: 0 })

      // broadcast: exclude the sender ws
      socket.broadcast.emit(privateMsgEvent, msg)
    })
  }
})

export default server
