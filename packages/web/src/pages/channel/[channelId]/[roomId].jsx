import Avatar from '@/components/Avatar'
import Layout from '@/pages/Layout'
import { getChannelUserInfo, getRoomInfo, getRoomList, getWhoami } from '@/utils/apiUtils'
import EmojiPicker from 'emoji-picker-react'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { io } from 'socket.io-client'
import ChannelLayout from '../ChannelLayout'
import { getLatestStoredRMOffset, getRMFromLocalStorage, storeRoomMsg } from '@/utils/msgUtils'

let socket

// msg format
function buildRoomMsgEvent (roomId) {
  return 'roomMsgEvent_' + roomId
}

function buildRoomMsgInitEvent (roomId) {
  return 'roomMsgInitEvent_' + roomId
}

ChannelRoom.getLayout = function getLayout (page) {
  const router = useRouter()
  return (
    <Layout>
      <ChannelLayout channelId={router.query.channelId}>{page}</ChannelLayout>
    </Layout>
  )
}

// component entry point
export default function ChannelRoom () {
  const router = useRouter()
  const channelId = router.query.channelId
  const roomId = router.query.roomId
  const [loadEmojiKeyboard, setLoadEmojiKeyboard] = useState(false)
  const $msgInput = useRef()
  const { data, isLoading, error } = useQuery(['getRoomInfo', roomId], () => getRoomInfo(roomId))
  const [currMsgList, setCurrMsgList] = useState([])
  const whoamiQuery = useQuery('whoami', getWhoami)
  useWebSocket(roomId, setCurrMsgList) // connect to websocket for room

  // init effect
  useEffect(() => {
    // initiate input
    cleanInputMsg()
    // initiate currMsgList
    setCurrMsgList([])
  }, [roomId])

  function onClickEmoji (emojiOjb) {
    $msgInput.current.value += emojiOjb.emoji
  }

  function cleanInputMsg () {
    if ($msgInput.current) {
      $msgInput.current.value = ''
    }
  }

  // At least once message arrival
  function emit (msg) {
    if (msg.ext?.retryTimes < 0) {
      console.log('Ran out of retry times.')
      return
    }
    if (socket && socket.connected) {
      const roomMsgEvent = buildRoomMsgEvent(roomId)
      // todo guarantee the msg won't miss, we need to impl ack mechanism with https://socket.io/docs/v4/emitting-events/#acknowledgements
      socket.timeout(2000).emit(roomMsgEvent, msg, (err, resp) => {
        if (err) {
          // retry sending msg, cuz the other side did not acknowledge the event in the given delay
          console.log('emit error, going to retry, e=' + JSON.stringify(err))
          msg.ext.retryTimes--
          emit(msg)
        } else {
          // todo backend msg id from resp
          const persistedMsgId = resp.sentMsg?.id
          msg.id = persistedMsgId
          renderMsg(msg, setCurrMsgList, roomId)
        }
      })
    }
  }

  function onKeyDownMessaging (e) {
    if (e.nativeEvent.isComposing) {
      // handle chinese keyboard composing
      return
    }
    if (e.code != 'Enter' || !roomId) {
      return
    }
    const msgInput = $msgInput.current.value
    if (!msgInput || msgInput.length > 5000) {
      console.log('invalid input:' + msgInput)
      return
    }
    const whoami = whoamiQuery?.data?.data?.username || 'Yourself'
    const msg2Send = {
      content: msgInput,
      senderUsername: whoami,
      ext: { retryTimes: 3 }
    }
    cleanInputMsg()
    emit(msg2Send)
  }

  return (
    <div className='p-3 w-full h-full flex flex-col overflow-hidden text-white'>
      <div className='p-2 border-b-[1px] border-solid border-b-[#323437] text-white shrink-0'>
        <p className='font-bold text-2xl'>{data?.data?.name}</p>
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

function saveAndRenderMsg (newMsg, setCurrMsgList, roomId) {
  if (newMsg == null || roomId == null) {
    return
  }

  storeRoomMsg(roomId, newMsg)
  renderMsg(newMsg, setCurrMsgList)
}

// render the msg panel
function renderMsg (newMsg, setCurrMsgList) {
  if (newMsg == null || setCurrMsgList == null) {
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

function useWebSocket (roomId, setCurrMsgList) {
  useEffect(() => {
    const msgOffset = getLatestStoredRMOffset(roomId)
    console.log('msgOffset:' + msgOffset)
    if (roomId) {
      // fixme useEffect runs twice, socket connects twice
      socket = io(process.env.NEXT_PUBLIC_WS_HOST, {
        withCredentials: true, // send cookies
        transports: ['websocket'],
        query: {
          roomId,
          roomMsgOffset: msgOffset
        }
      })

      socket.on('connect', () => {
        console.log(roomId + ' connected.')
      })

      socket.on('disconnect', () => {
        console.log(roomId + ' disconnected.')
      })

      // on initiating & receiving room msg
      const roomMsgEvent = buildRoomMsgEvent(roomId)
      const roomMsgInitEvent = buildRoomMsgInitEvent(roomId)
      socket.on(roomMsgEvent, function (msg) {
        saveAndRenderMsg(msg, setCurrMsgList, roomId)
      })
      socket.on(roomMsgInitEvent, function (msgList) {
        // get msg from cache
        const cachedMsg = getRMFromLocalStorage(roomId)
        renderMsg(cachedMsg, setCurrMsgList, roomId)
        // render the rest of missing messages
        saveAndRenderMsg(msgList, setCurrMsgList, roomId)
      })
    }
    return () => { socket?.disconnect() }
  }, [roomId])
}
