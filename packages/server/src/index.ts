import server from '@/service/ws/wsService'

server.listen(2000, () => {
  console.log('listening on *:2000')
})
