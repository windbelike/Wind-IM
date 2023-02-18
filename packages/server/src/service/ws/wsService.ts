import { Server } from 'socket.io'

import express from 'express'
import dotenv from 'dotenv'
import http from 'http'
import cookie from 'cookie'
import jwt from 'jsonwebtoken'
import { prisma } from '@/utils/prismaHolder'
import { getUserFromCookieToken } from '@/utils/authUtils'

dotenv.config()

const app = express()
const server = http.createServer(app)

const io = new Server(server,
  {
    cors: {
      origin: 'http://localhost:3000'
    }
  }
)

app.get('/', (req, res) => {
  res.send('Hello ws')
})

io.on('connection', async (socket) => {
  let cookies
  try {
    cookies = cookie.parse(socket.handshake.headers.cookie)
  } catch (e) {
    console.error(e)
  }
  const msgId = socket.handshake.query?.privateMsgId
  console.log(JSON.stringify(socket.handshake.query))
  const user = await getUserFromCookieToken(cookies?.token)
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
