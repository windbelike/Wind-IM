import dotenv from 'dotenv'
import { Server } from 'socket.io'
import { DefaultEventsMap } from 'socket.io/dist/typed-events'
import express from 'express'
import http from 'http'
import * as Boom from '@hapi/boom'

import { SocketData, wsAuthMiddleWare, wsOnConnect } from '@/service/ws/wsService'

dotenv.config()

const app = express()
const server = http.createServer(app)

function httpAuth (req, res, next) {
  console.log('httpAuth')
  next()
}

app.get('/', httpAuth, (req, res) => {
  res.send('Hello ws')
})

app.get('/error', httpAuth, (req, res) => {
  throw Boom.forbidden('hello Boom')
})

app.use((err, req, res, next) => {
  console.error(err)
  // 如果是一个 Boom 异常，则根据 Boom 异常结构修改 `res`
  if (Boom.isBoom(err)) {
    res.status(err.output.payload.statusCode)
    res.json({
      error: err.output.payload.error,
      message: err.output.payload.message
    })
  } else {
    res.status(500)
    res.json({
      error: err,
      message: 'Unexpected error'
    })
  }
})

// ws io
const io = new Server<DefaultEventsMap, DefaultEventsMap, DefaultEventsMap, SocketData>(server,
  {
    cors: {
      origin: 'http://localhost:3000'
    }
  }
)

io.use(wsAuthMiddleWare).on('connection', wsOnConnect)

server.listen(2000, () => {
  console.log('listening on *:2000')
})
