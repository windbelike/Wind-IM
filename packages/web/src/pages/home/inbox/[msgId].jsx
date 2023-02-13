import { useRouter } from 'next/router'
import { HomeDashboard } from '..'
import { io } from 'socket.io-client'
import { useEffect, useState } from 'react'
import getCookie from '@/components/CookieUtils'

export default function Inbox () {
  const router = useRouter()
  const { msgId } = router.query
  useEffect(() => {
    let socket
    if (msgId) {
      socket = io('ws://localhost:2000', {
        withCredentials: true, // send cookies
        transports: ['websocket']
      })

      socket.on('connect', () => {
        console.log(socket.id + ' connected.')
      })

      socket.on('disconnect', () => {
        console.log(msgId + ' disconnected.')
      })
    }
    return () => { socket && socket.disconnect() }
  }, [msgId])

  return (
    <HomeDashboard>
      <div className='p-5'>
        <p className='text-white'>msgId: {msgId}</p>

      </div>
    </HomeDashboard>
  )
}
