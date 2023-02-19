import { useRouter } from 'next/router'
import { io } from 'socket.io-client'
import { useEffect, useRef, useState } from 'react'
import HomeDashboard from '../HomeDashboard'

let socket

export default function Inbox () {
  const router = useRouter()
  const { privateMsgId } = router.query
  const [currMsgList, setCurrMsgList] = useState([])
  const $currMsgList = useRef([])
  $currMsgList.current = currMsgList
  const $msgInput = useRef()
  useWs(privateMsgId, $currMsgList, setCurrMsgList)

  useEffect(() => {
    // initiate input
    cleanInputMsg()
    // initiate currMsgList
    setCurrMsgList([])
  }, [privateMsgId])

  // todo 根据msgId获取双方的基础信息，如头像

  function onKeyDownMessaging (e) {
    if (e.nativeEvent.isComposing) {
      // handle chinese keyboard composing
      return
    }
    if (e.code != 'Enter' || !privateMsgId) {
      return
    }
    const msgInput = $msgInput.current.value
    if (!msgInput || msgInput.length > 5000) {
      console.log('invalid input:' + msgInput)
      return
    }
    const msg2Send = {
      content: msgInput
    }
    cleanInputMsg()
    emit(msg2Send)
  }

  function emit (msg) {
    if (socket && socket.connected) {
      const privateMsgEvent = 'privateMsgEvent_' + privateMsgId
      // todo guarantee the msg won't miss, we need to impl ack mechanism with https://socket.io/docs/v4/emitting-events/#acknowledgements
      socket.timeout(2000).emit(privateMsgEvent, msg, (err, resp) => {
        if (err) {
          // the other side did not acknowledge the event in the given delay
          // retry emit
          console.log('emit error, going to retry, e=' + JSON.stringify(err))
          emit(msg)
        } else {
          renderMsg({ ...msg, sendByMyself: true }, currMsgList, setCurrMsgList)
        }
      })
    }
  }

  function cleanInputMsg () {
    if ($msgInput.current) {
      $msgInput.current.value = ''
    }
  }

  return (
    <HomeDashboard>
      <div className='p-3 w-full h-full flex flex-col'>
        <div className='h-24 border-b-[1px] border-solid border-b-[#323437] text-white shrink-0'>
          Head
          <p className='text-white'>msgId: {privateMsgId}</p>
        </div>
        <div id="msgScroll" className='overflow-y-scroll scrollbar h-full my-3'>
          {/* <SingleMsg className='text-white' content={'test msg'} email={'unsetEmail'}/>
          <SingleMsg className='text-white' content={'test msg'} email={'unsetEmail'} sendByMyself={true}/>
          <SingleMsg className='text-white' content={'test msg'} email={'unsetEmail'}/> */}
          {currMsgList.map((m, idx) => {
            return <SingleMsg className='text-white' key={idx} content={m.content} sendByMyself={m.sendByMyself} email={'unsetEmail'}/>
          })}
        </div>
        <input className='break-all h-14 px-10 py-4 rounded-2xl text-white bg-[#36383e]' ref={$msgInput} onKeyDown={onKeyDownMessaging}/>
      </div>
    </HomeDashboard>
  )
}

function SingleMsg ({ email, content, sendByMyself = false }) {
  if (sendByMyself) {
    return (
      <div className='mx-2 px-2 text-white rounded-lg hover:bg-[#323437]'>
        <p className='text-right  break-words'>{content}</p>
      </div>
    )
  }
  return (
    <div className='mx-2 px-2  text-white rounded-lg hover:bg-[#323437]'>
      <p className='break-words'>{content}</p>
    </div>
  )
}

// render the msg panel
function renderMsg (msg, currMsgList, setCurrMsgList) {
  if (Array.isArray(msg)) {
    setCurrMsgList([...currMsgList, ...msg])
  } else {
    setCurrMsgList([...currMsgList, msg])
  }
  // wait for next tick
  setTimeout(() => {
    const msgScrollElement = document?.getElementById('msgScroll')
    msgScrollElement?.scrollTo(0, msgScrollElement?.scrollHeight)
  }, 0)
}

function useWs (privateMsgId, $currMsgList, setCurrMsgList) {
  useEffect(() => {
    if (privateMsgId) {
      // fixme useEffect runs twice, socket connects twice
      socket = io('ws://localhost:2000', {
        withCredentials: true, // send cookies
        transports: ['websocket'],
        query: {
          privateMsgId,
          privateMsgOffset: 0 // received private msg offset
        }
      })

      socket.on('connect', () => {
        console.log(privateMsgId + ' connected.')
      })

      socket.on('disconnect', () => {
        console.log(privateMsgId + ' disconnected.')
      })

      // on receive private msg
      const privateMsgEvent = 'privateMsgEvent_' + privateMsgId
      const privateMsgInitEvent = 'privateMsgInitEvent_' + privateMsgId
      socket.on(privateMsgInitEvent, function (msgList) {
        if (msgList) {
          renderMsg(msgList, $currMsgList.current, setCurrMsgList)
        }
      })
      socket.on(privateMsgEvent, function (msg) {
        console.log(`received msg:${JSON.stringify(msg)} for privateMsgId:${privateMsgId}`)
        renderMsg({ ...msg, sendByMyself: false }, $currMsgList.current, setCurrMsgList)
      })
    }
    return () => { socket?.disconnect() }
  }, [privateMsgId])
}
