import dotenv from 'dotenv'
import { Server } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import express from 'express'
import http from 'http'
import * as Boom from '@hapi/boom'
import cors from 'cors'

import { SocketData, wsAuthMiddleware, wsOnConnect } from '@/service/ws/wsPrivateMsgService'
import { loginValidator } from './utils/authUtils'
import { privateMsgGet, privateMsgListGet, privateMsgPost } from './handler/http/privateMsgHandler'
import { whoami } from './handler/http/userHandler'
import { errorHandler } from './handler/http/errorHandler'
import { loginPost } from './handler/http/loginHandler'
import { signupPost } from './handler/http/signupHandler'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import { logoutPost } from './handler/http/logoutHandler'
import { friendReqGet, friendReqPost } from './handler/http/friendReqhandler'
import { friendGet } from './handler/http/friendHandler'
import { channelListGet, channelJoinPost, channelPost, channelMembersGet, channelDelete } from './handler/http/channelHandler'
import { roomListGet } from './handler/http/roomHandler'

dotenv.config()
const FRONTEND_HOST = process.env.FRONTEND_HOST

const app = express()
const server = http.createServer(app)

const corsOptions = {
  credentials: true,
  origin: FRONTEND_HOST,
  optionsSuccessStatus: 200
}

// http service

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cors(corsOptions))
  .get('/', (req, res) => {
    res.send('Hello Wind-IM.')
  })
  .get('/r', (req, res) => {
    res.redirect('/api/whoami')
  })
  .get('/error', (req, res, next) => {
    next(Boom.forbidden('hello Boom'))
  })
  .get('/api/whoami', loginValidator, whoami)
  .get('/api/msg/privateMsgList', loginValidator, privateMsgListGet)
  .get('/api/msg/privateMsg', loginValidator, privateMsgGet)
  .post('/api/msg/privateMsg', loginValidator, privateMsgPost)
  .post('/api/login', loginPost)
  .post('/api/signup', signupPost)
  .post('/api/logout', loginValidator, logoutPost)
  .get('/api/friendRequest', loginValidator, friendReqGet)
  .post('/api/friendRequest', loginValidator, friendReqPost)
  .get('/api/friend', loginValidator, friendGet)
  .post('/api/channel', loginValidator, channelPost)
  .get('/api/channelList', loginValidator, channelListGet)
  .post('/api/channel/join', loginValidator, channelJoinPost)
  .get('/api/channel/members', loginValidator, channelMembersGet)
  .post('/api/channel/delete', loginValidator, channelDelete)
  .get('/api/roomList', loginValidator, roomListGet)
  .get('/api/leave', loginValidator, (req, res) => { console.log('/api/leave') })

  .use(errorHandler) // for handling global error

// ws service
const io = new Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketData>(server,
  {
    cors: {
      origin: FRONTEND_HOST
    }
  }
)

io.use(wsAuthMiddleware)
  .on('connection', wsOnConnect)

// start http & ws server
server.listen(2000, () => {
  console.log('listening on *:2000')
})
