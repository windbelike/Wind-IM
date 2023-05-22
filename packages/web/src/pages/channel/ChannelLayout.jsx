import { beOfflineInChannel, beOnlineInChannel, deleteChannel, getChannelInfo, getChannelUserInfo, getInviteUrl, getPrivateMsg, getRoomList, leaveChannel } from '@/utils/apiUtils'
import Link from 'next/link'
import { useMutation, useQuery } from 'react-query'
import { AiOutlineNumber, AiOutlineMenu } from 'react-icons/ai'
import { useEffect, useState } from 'react'
import Avatar from '@/components/Avatar'

export default function ChannelLayout ({ children, channelId }) {
  // handle being online or offline in a channel
  useChannelOnlineStatus(channelId)

  return (
    <div className='h-full w-full bg-[#25272a] flex'>
      <ChannelSidebar channelId={channelId} />
      {children}
      <ChannelRightSidebar channelId={channelId} />
    </div>
  )
}

function useChannelOnlineStatus (channelId) {
  useEffect(() => {
    beOnlineInChannel(channelId)
    async function notifyOffline () {
      console.log('Being offline in channel:' + channelId)
      beOfflineInChannel(channelId)
    }
    function onBeforeUnload (event) {
      notifyOffline()
    }
    addEventListener('beforeunload', onBeforeUnload)
    return () => {
      notifyOffline()
      removeEventListener('beforeunload', onBeforeUnload)
    }
  }, [channelId])
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
        {/* <div className='mt-auto flex flex-col space-y-3'>
          <button className='bg-gray-400 text-white rounded-md' onClick={onClickLeaveChannel}>Leave Channel</button>
          <button className='bg-red-700 text-white rounded-md' onClick={onClickDeleteChannel}>Delete Channel</button>
        </div> */}
      </div>
    </>
  )
}

function ChannelRightSidebar ({ channelId }) {
  const { data, error, isLoading } = useQuery(['getChannelMembers', channelId], () => getChannelUserInfo(channelId))

  return (
    <div className='ml-auto overflow-hidden w-[300px] border-l-[1px] border-solid border-l-[#323437] p-3 text-white'>
      <div>
        <div>ONLINE - {data ? data.data?.onlineUserCnt : 0}</div>
        {data != null && data.data?.members?.filter(m => m.online).map((member) => {
          return (
            <div key={member.uid} className='flex my-1 items-center space-x-3 p-2 hover:bg-gray-600 rounded-lg'>
              <Avatar username={member.userRel?.username} />
              <p className='font-bold'>{member.userRel?.username}</p>
            </div>
          )
        })}
      </div>
      <div>
        <div>OFFLINE - {data ? data.data?.offlineUserCnt : 0}</div>
        {data != null && data.data?.members?.filter(m => !m.online).map((member) => {
          return (
            <div key={member.uid} className='flex my-1 items-center space-x-3 p-2 hover:bg-gray-600 rounded-lg'>
              <Avatar username={member.userRel?.username} />
              <p className='font-bold'>{member.userRel?.username}</p>
            </div>
          )
        })}
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
        <button onClick={onMenuClick} className='ml-auto hover:cursor-pointer'><AiOutlineMenu size={20} /></button>
      </div>
      {manueActive && <ChannelMenu channelId={channelId} />}
    </div>

  )
}

function ChannelMenu ({ channelId }) {
  function onClickInvitePeople () {
    // open modal
    const dialog = document.querySelector('dialog')
    dialog.showModal() // Opens a modal
    // close when clicking else where
    dialog.addEventListener('click', e => {
      const dialogDimensions = dialog.getBoundingClientRect()
      if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
      ) {
        dialog.close()
      }
    })
  }

  return (
    <div className='absolute flex w-full px-7'>
      <div className='flex flex-col bg-[rgb(23,24,26)] rounded-md w-full text-gray-200 p-3'>
        <span className='hover:cursor-pointer p-1 hover:bg-[#3b3c3f] rounded-lg' onClick={onClickInvitePeople}>Invite People</span>
        <span className='hover:cursor-pointer p-1 hover:bg-[#3b3c3f] rounded-lg'>Channel Settings</span>
      </div>
      <dialog className='backdrop:bg-[rgba(0,0,0,0.5)] w-96 h-48 rounded-lg'>
        <InviteDialogContent channelId={channelId}/>
      </dialog>
    </div>
  )
}

function InviteDialogContent ({ channelId }) {
  // request api for a invite url
  const { data, isLoading, error } = useQuery(['getInviteUrl', channelId], () => getInviteUrl(channelId))
  console.log(data?.data)

  return (
    <div className=''>
      <span>Invite friends to this channel.</span>
      {/* display invite url */}
      <div className='flex items-center space-x-3'>
        <div className='w-full p-1 rounded-md'> {data?.data?.inviteUrl}</div>
        <button className='bg-gray-400 text-white rounded-md p-1'>Copy</button>
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
