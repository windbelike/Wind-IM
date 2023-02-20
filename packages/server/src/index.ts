import dotenv from 'dotenv'
import { Server } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import express from 'express'
import http from 'http'
import * as Boom from '@hapi/boom'
import cors from 'cors'

import { SocketData, wsAuthMiddleware, wsOnConnect } from '@/service/ws/wsPrivateMsgService'
import { loginValidator } from './utils/authUtils'
import { privateMsgGet, privateMsgPost } from './handler/http/privateMsgHandler'
import { whoami } from './handler/http/userHandler'
import { errorHandler } from './handler/http/errorHandler'
import { loginPost } from './handler/http/loginHandler'
import { signupPost } from './handler/http/signupHandler'
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import { logoutPost } from './handler/http/logoutHandler'

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
  .get('/error', (req, res) => {
    throw Boom.forbidden('hello Boom')
  })
  .get('/api/msg/privateMsg', loginValidator, privateMsgGet)
  .get('/api/whoami', whoami)
  .post('/api/msg/privateMsg', loginValidator, privateMsgPost)
  .post('/api/login', loginPost)
  .post('/api/singup', signupPost)
  .post('/api/logout', loginValidator, logoutPost)

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
