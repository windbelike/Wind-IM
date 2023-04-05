import { deleteChannel, getPrivateMsg, getRoomList, getWhoami, leaveChannel } from '@/utils/apiUtils'
import Link from 'next/link'
import { useMutation, useQuery } from 'react-query'
import { AiOutlineNumber } from 'react-icons/ai'

export default function ChannelLayout ({ children, channelId }) {
  console.log('ChannelLayout channelId:' + channelId)
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
      <div className="p-5 shrink-0 flex flex-col h-full w-64 border-r-[1px] border-solid border-r-[#323437] overflow-y-hidden">
        <UserInfoPanel />
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
  return (
    <></>
  )
}

function UserInfoPanel () {
  const { isLoading, data, error } = useQuery('getWhoami', getWhoami)
  return (
    <div className="">
      {isLoading && <p className="text-[#e6eaf0] font-bold">Anonymous</p>}
      {data && <p className="text-[#e6eaf0] font-bold">{data.data?.username}#{data.data?.tag}</p>}
    </div>
  )
}

function TextPannel ({ channelId }) {
  const { data, isLoading, error } = useQuery(['getRoomList', channelId], () => getRoomList(channelId))
  if (data) {
    console.log('roomList:' + JSON.stringify(data.data))
  }
  return (
    <div className='mt-3'>
      {/* <div className='text-white'>{'roomList:' + JSON.stringify(data?.data)}</div> */}
      <p className='text-[#e6eaf0] text-sm mt-2'>TEXT ROOMS</p>
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
    <div className='mt-3'>
      <p className='text-[#e6eaf0] text-sm mt-2'>VOICE ROOMS</p>
      <div className='ml-4 mt-1'>
        <VoiceSelection name="Default" to='/channel/voice'/>
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