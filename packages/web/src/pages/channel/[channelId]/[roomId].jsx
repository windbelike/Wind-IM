import Layout from '@/pages/Layout'
import { getChannelMembers, getRoomInfo, getRoomList } from '@/utils/apiUtils'
import axios from '@/utils/axiosUtils'
import EmojiPicker from 'emoji-picker-react'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { useQuery } from 'react-query'
import ChannelLayout from '../ChannelLayout'

ChannelRoom.getLayout = function getLayout (page) {
  const router = useRouter()
  return (
    <Layout>
      <ChannelLayout channelId={router.query.channelId}>{page}</ChannelLayout>
    </Layout>
  )
}

export default function ChannelRoom () {
  const router = useRouter()
  const channelId = router.query.channelId
  const roomId = router.query.roomId
  const [loadEmojiKeyboard, setLoadEmojiKeyboard] = useState(false)
  const $msgInput = useRef()
  const { data, isLoading, error } = useQuery(['getRoomInfo', roomId], () => getRoomInfo(roomId))

  console.log(data)

  // handle being online or offline in a channel
  useEffect(() => {
    async function notifyOffline () {
      console.log('Being offline in channel:' + channelId)
      axios.get('/api/leave')
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

  const currMsgList = []
  const privateMsgInfo = null

  function onClickEmoji (emojiOjb) {
    $msgInput.current.value += emojiOjb.emoji
  }

  function onKeyDownMessaging (e) {
    console.log('onKeyDownMessaging')
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

function SingleMsg () {
  return (
    <></>

  )
}
