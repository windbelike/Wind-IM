import { getPrivateMsg, getWhoami } from '@/utils/apiUtils'
import Link from 'next/link'
import { useQuery } from 'react-query'

export default function ChannelDashboard ({ children, channelId }) {
  return (
    <div className='h-full w-full p-5 bg-[#25272a] flex'>
      <ChannelSidebar channelId={channelId} />
      {children}
    </div>
  )
}

function ChannelSidebar ({ channelId }) {
  return (
    <>
      <div className="p-2 shrink-0 flex flex-col h-full w-64 border-r-[1px] border-solid border-r-[#323437] overflow-y-hidden">
        <UserInfoPanel />
        <TextPannel channelId={channelId}/>
        <VoicePannel channelId={channelId}/>
      </div>
    </>
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
  return (
    <div className='mt-3'>
      <p className='text-[#e6eaf0] text-sm mt-2'>Text Rooms</p>
      <div className='ml-4 mt-1'>
        <TextPannelSelection name='Default' to='/channel/text'/>
      </div>
    </div>
  )
}

function TextPannelSelection ({ icon, name, cnt, to }) {
  return (
    <>
      <Link href={to}>
        <div className='text-gray-400 p-1 rounded-md hover:bg-[#3b3c3f] hover:cursor-pointer'>{name}</div>
      </Link>
    </>
  )
}

function VoicePannel () {
  const { error, isLoading, data } = useQuery('getPrivateMsg', getPrivateMsg)
  return (
    <div className='mt-3'>
      <p className='text-[#e6eaf0] text-sm mt-2'>Voice Rooms</p>
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
