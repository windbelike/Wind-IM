import { beOfflineOnChannel, beOnlineOnChannel, deleteChannel, getChannelInfo, getChannelOnlineInfo, getPrivateMsg, getRoomList, getWhoami, leaveChannel } from '@/utils/apiUtils'
import Link from 'next/link'
import { useMutation, useQuery } from 'react-query'
import { AiOutlineNumber, AiOutlineMenu } from 'react-icons/ai'
import { useEffect, useState } from 'react'

export default function ChannelLayout ({ children, channelId }) {
  // handle being online or offline in a channel
  useEffect(() => {
    beOnlineOnChannel(channelId)
    async function notifyOffline () {
      console.log('Being offline in channel:' + channelId)
      beOfflineOnChannel(channelId)
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

  return (
    <div className='h-full w-full bg-[#25272a] flex'>
      <ChannelSidebar channelId={channelId} />
      {children}
      <ChannelRightSidebar channelId={channelId} />
    </div>
  )
}

function ChannelSidebar ({ channelId }) {
  const deleteChannelMut = useMutation('deleteChannel', deleteChannel)
  const leaveChannelMut = useMutation('leaveChannel', leaveChannel)

  function onClickDeleteChannel () {
    if (window.confirm('Do you really want to delete this channel?')) {
      deleteChannelMut.mutate({ channelId })
    }
  }

  function onClickLeaveChannel () {
    if (window.confirm('Do you really want to leave this channel?')) {
      leaveChannelMut.mutate({ channelId })
    }
  }

  return (
    <>
      <div className="shrink-0 flex flex-col h-full w-64 border-r-[1px] border-solid border-r-[#323437] overflow-y-hidden">
        <ChannelInfoPanel channelId={channelId}/>
        <TextPannel channelId={channelId}/>
        <VoicePannel channelId={channelId}/>
        <div className='mt-auto flex flex-col space-y-3'>
          <button className='bg-gray-400 text-white rounded-md' onClick={onClickLeaveChannel}>Leave Channel</button>
          {/* owner only operation */}
          <button className='bg-red-700 text-white rounded-md' onClick={onClickDeleteChannel}>Delete Channel</button>
        </div>
      </div>
    </>
  )
}

function ChannelRightSidebar ({ channelId }) {
  const { data, error, isLoading } = useQuery(['getChannelMembers', channelId], () => getChannelOnlineInfo(channelId))

  return (
    <div className='ml-auto overflow-hidden w-[300px] border-l-[1px] border-solid border-l-[#323437] p-3 text-white'>
      <div>
        <div>ONLINE - {data ? data.data?.onlineUserCnt : 0}</div>
      </div>
      <div>
        <div>OFFLINE - 0</div>
        <div className='break-words'>data:{JSON.stringify(data?.data)}</div>
      </div>
    </div>
  )
}

function ChannelInfoPanel ({ channelId }) {
  const { data, isLoading, error } = useQuery(['getChannelInfo', channelId], () => getChannelInfo(channelId))
  const [manueActive, setManueActive] = useState(false)
  function onMenuClick () {
    console.log('menu click')
    setManueActive(!manueActive)
  }

  return (
    <div className='relative'>
      <div className="p-4 text-[#e6eaf0] font-bold text-xl flex items-center border-b-[1px] border-[#323437]">
        {isLoading && <p >Anonymous</p>}
        {data && <p>{data.data?.name}</p>}
        <div onClick={onMenuClick} className='ml-auto hover:cursor-pointer'><AiOutlineMenu size={20} /></div>
      </div>
      {manueActive && <ChannelMenu />}
    </div>

  )
}

function ChannelMenu () {
  return (
    <div className='absolute flex w-full h-[100px] p-3'>
      <div className='flex flex-col bg-black rounded-md w-full text-white p-1'>
        <span>Invite People</span>
        <span>Channel Settings</span>
      </div>
    </div>
  )
}

function TextPannel ({ channelId }) {
  const { data, isLoading, error } = useQuery(['getRoomList', channelId], () => getRoomList(channelId))
  return (
    <div className='p-4 mt-3'>
      <p className='text-[#e6eaf0] text-sm'>TEXT ROOMS</p>
      <div className='ml-4 mt-1'>
        {data?.data?.map((room) => {
          return (
            <TextPannelSelection key={room.id} name={room.name} to={`/channel/${channelId}/${room.id}`}/>
          )
        })}
      </div>
    </div>
  )
}

function TextPannelSelection ({ icon, name, cnt, to }) {
  return (
    <>
      <Link href={to}>
        <div className='text-gray-400 p-1 rounded-md hover:bg-[#3b3c3f] hover:cursor-pointer'>
          <div className='flex items-center'>
            <AiOutlineNumber size={24}/>
            <span>{name}</span>
          </div>
        </div>
      </Link>
    </>
  )
}

function VoicePannel () {
  const { error, isLoading, data } = useQuery('getPrivateMsg', getPrivateMsg)
  return (
    <div className='p-4'>
      <p className='text-[#e6eaf0] text-sm mt-2'>VOICE ROOMS</p>
      <div className='ml-4 mt-1'>
        {/* <VoiceSelection name="Default" to='/channel/voice'/> */}
      </div>
    </div>
  )
}

function VoiceSelection ({ icon, name, cnt, to }) {
  return (
    <>
      <Link href={to}>
        <div className='text-gray-400 p-1 rounded-md hover:bg-[#3b3c3f] hover:cursor-pointer'>{name}</div>
      </Link>
    </>
  )
}
