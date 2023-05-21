import { useRouter } from 'next/router'
import { io } from 'socket.io-client'
import { useEffect, useRef, useState } from 'react'
import HomeLayout from '../HomeLayout'
import EmojiPicker from 'emoji-picker-react'
import { useQuery } from 'react-query'
import Avatar from '@/components/Avatar'
import { getPrivateMsgInfo, getWhoami } from '@/utils/apiUtils'
import Layout from '@/pages/Layout'
import { getDMfromLocalStorage, getLatestStoredDMOffset, storeDirectMsg } from '@/utils/msgUtils'

// todo implement client side msg storage with offset

const defaultRetryTimes = 3

let socket

DirectMessage.getLayout = function getLayout (page) {
  return (
    <Layout>
      <HomeLayout>{page}</HomeLayout>
    </Layout>
  )
}

function buildPrivateMsgEvent (privateMsgId) {
  return 'privateMsgEvent_' + privateMsgId
}

function buildInitPrivateMsgEvent (privateMsgId) {
  return 'privateMsgInitEvent_' + privateMsgId
}

// component entry point
export default function DirectMessage () {
  const { isLoading, data, error } = useQuery('whoami', getWhoami)
  if (error) {
    console.error(error)
  }
  const router = useRouter()
  const { privateMsgId } = router.query
  const privateMsgInfo = useQuery(['getPrivateMsgInfo', privateMsgId], () => getPrivateMsgInfo(privateMsgId))
  const [currMsgList, setCurrMsgList] = useState([])
  const $msgInput = useRef()
  useWs(privateMsgId, setCurrMsgList)
  const [loadEmojiKeyboard, setLoadEmojiKeyboard] = useState(false)

  // init effect
  useEffect(() => {
    // initiate input
    cleanInputMsg()
    // initiate currMsgList
    setCurrMsgList([])
  }, [privateMsgId])

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
      senderUsername: whoami,
      ext: { retryTimes: defaultRetryTimes }
    }
    cleanInputMsg()
    emitMessage(msg2Send)
  }

  // At least once message arrival
  function emitMessage (msg) {
    if (msg.ext?.retryTimes < 0) {
      console.log('Ran out of retry times.')
      return
    }
    if (socket && socket.connected) {
      const privateMsgEvent = buildPrivateMsgEvent(privateMsgId)
      // todo guarantee the msg won't miss, we need to impl ack mechanism with https://socket.io/docs/v4/emitting-events/#acknowledgements
      socket.timeout(2000).emit(privateMsgEvent, msg, (err, resp) => {
        if (err) {
          // retry sending msg, cuz the other side did not acknowledge the event in the given delay
          console.log('emit error, going to retry, e=' + JSON.stringify(err))
          msg.ext.retryTimes--
          emitMessage(msg)
        } else {
          const persistedMsgId = resp.sentMsg?.id
          msg.id = persistedMsgId
          renderMsg(msg, setCurrMsgList, privateMsgId)
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
    <div className='p-3 w-full h-full flex flex-col overflow-hidden'>
      <div className='space-y-3 p-2 border-b-[1px] border-solid border-b-[#323437] text-white shrink-0'>
        <p className='font-bold text-2xl'>{privateMsgInfo?.data?.data?.msgTitle}</p>
        {/* <p className='text-white'>msgId: {privateMsgId}</p> */}
        <p className='text-[#717579]'>Direct message with {privateMsgInfo?.data?.data?.msgTitle}</p>
      </div>
      <div id="msgScroll" className='overflow-y-scroll scrollbar h-full my-3'>
        {/* <SingleMsg className='text-white' content={'test msg'} email={'unsetEmail'}/>
          <SingleMsg className='text-white' content={'test msg'} email={'unsetEmail'}/> */}
        {currMsgList.map((m, idx) => {
          return <SingleMsg className='text-white' key={idx} content={m.content} username={m.senderUsername}/>
        })}
      </div>
      <div className='fixed right-20 bottom-32'>{ loadEmojiKeyboard && <EmojiPicker searchDisabled={true} theme='dark' emojiStyle='native' onEmojiClick={onClickEmoji}/> }
      </div>
      <div className='flex items-center'>
        <input className='break-all h-14 w-full px-10 py-4 rounded-2xl text-white bg-[#36383e]' ref={$msgInput} onKeyDown={onKeyDownMessaging}/>
        <button className='w-10 h-10' onClick={() => setLoadEmojiKeyboard(!loadEmojiKeyboard)}>😊</button>
      </div>
    </div>
  )
}

function SingleMsg ({ username, content }) {
  return (
    <>
      <div className='flex mx-2 p-3 text-white rounded-lg hover:bg-[#323437] duration-300 ease-linear'>
        {/* <img className='w-12 h-12 bg-white rounded-full' src="https://avatars.githubusercontent.com/u/33996345?v=4" alt="" /> */}
        <Avatar username={username} />
        <div className='flex flex-col items-start mx-2'>
          <p className='font-bold'>{username}</p>
          <p className={'break-all '}>{content}</p>
        </div>
      </div>
    </>
  )
}

// render the msg panel
function saveAndRenderMsg (newMsg, setCurrMsgList, privateMsgId) {
  if (newMsg == null || privateMsgId == null) {
    return
  }
  // store msg to localStorage
  storeDirectMsg(privateMsgId, newMsg)
  // render msg to screen
  renderMsg(newMsg, setCurrMsgList)
}

function renderMsg (newMsg, setCurrMsgList) {
  if (newMsg == null) {
    return
  }
  if (Array.isArray(newMsg)) {
    setCurrMsgList((currMsgList) => {
      return [...currMsgList, ...newMsg]
    })
  } else {
    setCurrMsgList((currMsgList) => {
      return [...currMsgList, newMsg]
    })
  }
  // wait for next tick
  setTimeout(() => {
    const msgScrollElement = document?.getElementById('msgScroll')
    msgScrollElement?.scrollTo(0, msgScrollElement?.scrollHeight)
  }, 0)
}

function useWs (privateMsgId, setCurrMsgList) {
  useEffect(() => {
    const msgOffset = getLatestStoredDMOffset(privateMsgId)
    console.log('msg offset:' + msgOffset)
    if (privateMsgId) {
      socket = io(process.env.NEXT_PUBLIC_WS_HOST, {
        withCredentials: true, // send cookies
        transports: ['websocket'],
        query: {
          privateMsgId,
          privateMsgOffset: msgOffset
        }
      })

      socket.on('connect', () => {
        console.log(privateMsgId + ' connected.')
      })

      socket.on('disconnect', () => {
        console.log(privateMsgId + ' disconnected.')
      })

      // on initiating & receiving private msg
      const privateMsgEvent = buildPrivateMsgEvent(privateMsgId)
      const privateMsgInitEvent = buildInitPrivateMsgEvent(privateMsgId)
      socket.on(privateMsgEvent, function (msg) {
        saveAndRenderMsg(msg, setCurrMsgList, privateMsgId)
      })
      socket.on(privateMsgInitEvent, function (msgList) {
        // init msg from localStorage
        const cachedMsg = getDMfromLocalStorage(privateMsgId)
        renderMsg(cachedMsg, setCurrMsgList, privateMsgId)
        // render the rest of missing messages
        saveAndRenderMsg(msgList, setCurrMsgList, privateMsgId)
      })
    }
    return () => { socket?.disconnect() }
  }, [privateMsgId])
}
