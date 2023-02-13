const express = require('express')
const { Server } = require('socket.io')
const http = require('http')
const dotenv = require('dotenv')
const cookie = require('cookie')

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

io.on('connection', (socket) => {
  const cookies = cookie.parse(socket.handshake.headers.cookie)
  console.log(`socket.id:"${socket.id}" connected with token:"${cookies?.token}"`)
  socket.on('disconnect', (reason) => {
    console.log(socket.id + ' disconnected. for reason:' + reason)
  })
  // socket.on('chat message', (msg) => {
  //   io.emit('chat message', msg)
  // })
})

server.listen(2000, () => {
  console.log('listening on *:2000')
})
