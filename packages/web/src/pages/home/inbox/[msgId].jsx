import { useRouter } from 'next/router'
import { HomeDashboard } from '..'
import { io } from 'socket.io-client'
import { useEffect, useRef, useState } from 'react'

let socket

export default function Inbox () {
  const router = useRouter()
  const { msgId } = router.query
  const [currMsgList, setCurrMsgList] = useState([])
  const $msgInput = useRef()
  const $currMsgList = useRef([])
  $currMsgList.current = currMsgList
  useWs(msgId, $currMsgList, setCurrMsgList)

  useEffect(() => {
    // initiate input
    if ($msgInput.current) {
      $msgInput.current.value = ''
    }
    // initiate currMsgList
    setCurrMsgList([])
  }, [msgId])

  // todo 根据msgId获取双方的基础信息，如头像

  function onKeyDownMessaging (e) {
    if (e.code == 'Enter') {
      const msgInput = $msgInput.current.value
      $msgInput.current.value = ''
      if (msgId && socket && msgInput) {
        const privateMsgEvent = 'privateMsgEvent_' + msgId
        // todo guarantee the msg won't miss, todo so we need to impl ack mechanism with https://socket.io/docs/v4/emitting-events/#acknowledgements
        socket.emit(privateMsgEvent, msgInput)
        renderMsg(msgInput, currMsgList, setCurrMsgList)
      }
    }
  }

  return (
    <HomeDashboard>
      <div className='p-3 w-full h-full flex flex-col'>
        <div className='h-24 border-b-[1px] border-solid border-b-[#323437] text-white shrink-0'>
          Head
          <p className='text-white'>msgId: {msgId}</p>
        </div>
        <div id="msgScroll" className='overflow-y-scroll scrollbar h-full my-3'>
          {currMsgList.map((m, idx) => {
            return <div className='text-white' key={idx}>{m}</div>
          })}
        </div>
        <input className='break-all h-14 px-10 py-4 rounded-2xl text-white bg-[#36383e]' ref={$msgInput} onKeyDown={onKeyDownMessaging}/>
      </div>
    </HomeDashboard>
  )
}

// render the msg panel
function renderMsg (msg, currMsgList, setCurrMsgList) {
  console.log('renderMsg:' + msg)
  setCurrMsgList([...currMsgList, msg])
  // wait for next tick
  setTimeout(() => {
    const msgScrollElement = document?.getElementById('msgScroll')
    msgScrollElement?.scrollTo(0, msgScrollElement?.scrollHeight)
  }, 0)
}

function useWs (msgId, $currMsgList, setCurrMsgList) {
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
        renderMsg(msg, $currMsgList.current, setCurrMsgList) // todo bug，注意currMsgList的词法作用域
      })
    }
    return () => { socket && socket.disconnect() }
  }, [msgId])
}
