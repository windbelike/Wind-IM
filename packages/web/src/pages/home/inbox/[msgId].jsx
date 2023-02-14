import { useRouter } from 'next/router'
import { HomeDashboard } from '..'
import { io } from 'socket.io-client'
import { useEffect, useRef, useState } from 'react'

let socket

export default function Inbox () {
  const router = useRouter()
  const { msgId } = router.query
  useWs(msgId)
  const $msgInput = useRef()
  // initiate input
  if ($msgInput.current) {
    $msgInput.current.value = ''
  }

  // 根据msgId获取双方的基础信息，如头像

  function onKeyDownMessaging (e) {
    if (e.code == 'Enter') {
      const msgInput = $msgInput.current.value
      $msgInput.current.value = ''
      if (msgId && socket && msgInput) {
        const privateMsgEvent = 'privateMsgEvent_' + msgId
        socket.emit(privateMsgEvent, msgInput)
      }
    }
  }

  return (
    <HomeDashboard>
      <div className='p-3 w-full h-full flex flex-col'>
        <div className='h-24 border-b-[1px] border-solid border-b-[#323437] text-white'>Head</div>
        <p className='text-white'>msgId: {msgId}</p>
        <div></div>
        <input className='break-all mt-auto h-14  px-10 py-4 rounded-2xl text-white bg-[#36383e]' ref={$msgInput} onKeyDown={onKeyDownMessaging}/>
      </div>
    </HomeDashboard>
  )
}

function useWs (msgId) {
  useEffect(() => {
    if (msgId) {
      socket = io('ws://localhost:2000', {
        withCredentials: true, // send cookies
        transports: ['websocket'],
        query: {
          privateMsgId: msgId
        }

      })

      socket.on('connect', () => {
        console.log(msgId + ' connected.')
      })

      socket.on('disconnect', () => {
        console.log(msgId + ' disconnected.')
      })

      const privateMsgEvent = 'privateMsgEvent_' + msgId
      socket.on(privateMsgEvent, function (msg) {
        console.log(`received msg:${msg} for msgId:{msgId}`)
        // window.scrollTo(0, document.body.scrollHeight)
      })
    }
    return () => { socket && socket.disconnect() }
  }, [msgId])
}
