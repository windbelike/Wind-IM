import { useRouter } from 'next/router'
import { io } from 'socket.io-client'
import { useEffect, useRef, useState } from 'react'
import HomeDashboard from '../HomeDashboard'
import EmojiPicker from 'emoji-picker-react'
import axios from '@/utils/axiosUtils'
import { useQuery } from 'react-query'

// todo implement client side msg storage with offset

async function getWhoami () {
  const result = await axios.get('/api/whoami')
  return result.data
}

const defaultRetryTimes = 3

let socket

export default function Inbox () {
  const { isLoading, data, error } = useQuery('whoami', getWhoami)
  const router = useRouter()
  const { privateMsgId } = router.query
  const [currMsgList, setCurrMsgList] = useState([])
  const $currMsgList = useRef([])
  $currMsgList.current = currMsgList
  const $msgInput = useRef()
  useWs(privateMsgId, $currMsgList, setCurrMsgList)
  const [loadEmojiKeyboard, setLoadEmojiKeyboard] = useState(false)

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
    const whoami = data?.data?.username || 'Yourself'
    const msg2Send = {
      content: msgInput,
      sendByMyself: true,
      senderUsername: whoami,
      ext: { retryTimes: defaultRetryTimes }
    }
    cleanInputMsg()
    emit(msg2Send)
  }

  // At least once message arrival
  function emit (msg) {
    if (msg.ext?.retryTimes < 0) {
      console.log('Ran out of retry times.')
      return
    }
    if (socket && socket.connected) {
      const privateMsgEvent = 'privateMsgEvent_' + privateMsgId
      // todo guarantee the msg won't miss, we need to impl ack mechanism with https://socket.io/docs/v4/emitting-events/#acknowledgements
      socket.timeout(2000).emit(privateMsgEvent, msg, (err, resp) => {
        if (err) {
          // retry sending msg, cuz the other side did not acknowledge the event in the given delay
          console.log('emit error, going to retry, e=' + JSON.stringify(err))
          msg.ext.retryTimes--
          emit(msg)
        } else {
          renderMsg(msg, currMsgList, setCurrMsgList)
        }
      })
    }
  }

  function cleanInputMsg () {
    if ($msgInput.current) {
      $msgInput.current.value = ''
    }
  }

  function onClickEmoji (emojiOjb) {
    $msgInput.current.value += emojiOjb.emoji
  }

  return (
    <HomeDashboard>
      <div className='p-3 w-full h-full flex flex-col overflow-hidden'>
        <div className='h-24 border-b-[1px] border-solid border-b-[#323437] text-white shrink-0'>
          Head
          <p className='text-white'>msgId: {privateMsgId}</p>
        </div>
        <div id="msgScroll" className='overflow-y-scroll scrollbar h-full my-3'>
          {/* <SingleMsg className='text-white' content={'test msg'} email={'unsetEmail'}/>
          <SingleMsg className='text-white' content={'test msg'} email={'unsetEmail'} sendByMyself={true}/>
          <SingleMsg className='text-white' content={'test msg'} email={'unsetEmail'}/> */}
          {currMsgList.map((m, idx) => {
            return <SingleMsg className='text-white' key={idx} content={m.content} sendByMyself={m.sendByMyself} username={m.senderUsername}/>
          })}
        </div>
        <div className='fixed right-20 bottom-32'>{ loadEmojiKeyboard && <EmojiPicker searchDisabled={true} theme='dark' emojiStyle='native' onEmojiClick={onClickEmoji}/> }
        </div>
        <div className='flex items-center'>
          <input className='break-all h-14 w-full px-10 py-4 rounded-2xl text-white bg-[#36383e]' ref={$msgInput} onKeyDown={onKeyDownMessaging}/>
          <button className='w-10 h-10' onClick={() => setLoadEmojiKeyboard(!loadEmojiKeyboard)}>😊</button>
        </div>
      </div>
    </HomeDashboard>
  )
}

function SingleMsg ({ username, content, sendByMyself = false }) {
  return (
    <>
      <div className='flex mx-2 p-3 text-white rounded-lg hover:bg-[#323437]'>
        <img className='w-12 h-12 bg-white rounded-full' src="https://avatars.githubusercontent.com/u/33996345?v=4" alt="" />
        <div className='flex flex-col items-start mx-2'>
          <p className='font-bold'>{username}</p>
          <p className={'break-all '}>{content}</p>
        </div>
      </div>
    </>
  )
}

// render the msg panel
function renderMsg (newMsg, currMsgList, setCurrMsgList) {
  if (!newMsg) {
    return
  }
  if (Array.isArray(newMsg)) {
    setCurrMsgList([...currMsgList, ...newMsg])
  } else {
    setCurrMsgList([...currMsgList, newMsg])
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
      socket = io(process.env.NEXT_PUBLIC_WS_HOST, {
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

      // on initiating & receiving private msg
      const privateMsgEvent = 'privateMsgEvent_' + privateMsgId
      const privateMsgInitEvent = 'privateMsgInitEvent_' + privateMsgId
      socket.on(privateMsgInitEvent, function (msgList) {
        renderMsg(msgList, $currMsgList.current, setCurrMsgList)
      })
      socket.on(privateMsgEvent, function (msg) {
        msg.sendByMyself = false
        renderMsg(msg, $currMsgList.current, setCurrMsgList)
      })
    }
    return () => { socket?.disconnect() }
  }, [privateMsgId])
}
