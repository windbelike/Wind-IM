import Avatar from '@/components/Avatar'
import Layout from '@/pages/Layout'
import { getChannelMembers, getRoomInfo, getRoomList, getWhoami } from '@/utils/apiUtils'
import axios from '@/utils/axiosUtils'
import EmojiPicker from 'emoji-picker-react'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import { io } from 'socket.io-client'
import ChannelLayout from '../ChannelLayout'

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
  const $currMsgList = useRef([])
  $currMsgList.current = currMsgList
  const whoamiQuery = useQuery('whoami', getWhoami)
  useWs(roomId, $currMsgList, setCurrMsgList) // connect to websocket for room

  // init effect
  useEffect(() => {
    // initiate input
    cleanInputMsg()
    // initiate currMsgList
    setCurrMsgList([])
  }, [roomId])

  // handle being online or offline in a channel
  useEffect(() => {
    async function notifyOffline () {
      console.log('Being offline in channel:' + channelId)
      await axios.get('/api/leave')
    }
    function onBeforeUnload (event) {
      notifyOffline()
    }
    console.log('Being online in channel:' + channelId)
    addEventListener('beforeunload', onBeforeUnload)
    return () => {
      notifyOffline()
      removeEventListener('beforeunload', onBeforeUnload)
    }
  }, [channelId])

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
          renderMsg(msg, currMsgList, setCurrMsgList)
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
      sendByMyself: true,
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

  )
}

function SingleMsg ({ username, content, sendByMyself = false }) {
  return (
    <>
      <div className='flex mx-2 p-3 text-white rounded-lg hover:bg-[#323437]'>
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

function useWs (roomId, $currMsgList, setCurrMsgList) {
  useEffect(() => {
    if (roomId) {
      // fixme useEffect runs twice, socket connects twice
      socket = io(process.env.NEXT_PUBLIC_WS_HOST, {
        withCredentials: true, // send cookies
        transports: ['websocket'],
        query: {
          roomId,
          roomMsgOffset: 0 // received room msg offset
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
      socket.on(roomMsgInitEvent, function (msgList) {
        renderMsg(msgList, $currMsgList.current, setCurrMsgList)
      })
      socket.on(roomMsgEvent, function (msg) {
        msg.sendByMyself = false
        console.log('on roomMsgEvent, msg=' + JSON.stringify(msg))
        // todo fix invalid msg username
        renderMsg(msg, $currMsgList.current, setCurrMsgList)
      })
    }
    return () => { socket?.disconnect() }
  }, [roomId])
}
