import server from '@src/service/ws/wsService'

server.listen(2000, () => {
  console.log('listening on *:2000')
})
