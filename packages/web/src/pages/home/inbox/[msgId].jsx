import { useRouter } from 'next/router'
import { HomeDashboard } from '..'
import { io } from 'socket.io-client'
import { useEffect, useState } from 'react'

export default function Inbox () {
  const router = useRouter()
  const { msgId } = router.query
  useWs(msgId)

  return (
    <HomeDashboard>
      <div className='p-3 w-full h-full flex flex-col'>
        <div className='h-24 border-b-[1px] border-solid border-b-[#323437] text-white'>Head</div>
        <p className='text-white'>msgId: {msgId}</p>
        <div></div>
        <input className='break-all mt-auto h-14  px-10 py-4 rounded-2xl text-white bg-[#36383e]' contentEditable></input>
      </div>
    </HomeDashboard>
  )
}

function useWs (msgId) {
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
}
