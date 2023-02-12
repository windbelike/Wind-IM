const express = require('express')
const { Server } = require('socket.io')
const http = require('http')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

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
  console.log(socket.id + ' connected. with auth:' + JSON.stringify(socket.handshake.auth))
  const payload = jwt.verify(socket.handshake.auth?.token, process.env.JWT_SECRET)
  console.log('email:' + payload?.email)
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
