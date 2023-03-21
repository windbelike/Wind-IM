import Link from 'next/link'
import { useQuery } from 'react-query'
import axios from '@/utils/axiosUtils'

async function getWhoami () {
  const result = await axios.get('/api/whoami')
  return result.data
}

export default function HomeSideBar () {
  return (
    <div className="p-2 shrink-0 flex flex-col h-full w-64 border-r-[1px] border-solid border-r-[#323437] overflow-y-hidden">
      <UserInfoPanel />
      <FriendPanel />
      <DirectMsgPanel />
    </div>
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

function FriendPanel () {
  return (
    <div className='mt-3'>
      <p className='text-[#e6eaf0] text-sm mt-2'>Friends</p>
      <div className='ml-4 mt-1'>
        <FriendSelection name='Online' to='/home/friend/online'/>
        <FriendSelection name='All' to='/home/friend/all'/>
        <FriendSelection name='Pending' to='/home/friend/pending'/>
      </div>
    </div>
  )
}

function FriendSelection ({ icon, name, cnt, to }) {
  return (
    <>
      <Link href={to}>
        <div className='text-gray-400 p-1 rounded-md hover:bg-[#3b3c3f] hover:cursor-pointer'>{name}</div>
      </Link>
    </>
  )
}

async function getPrivateMsg () {
  const result = await axios.get('/api/msg/privateMsg')
  return result.data
}
function DirectMsgPanel () {
  const { error, isLoading, data } = useQuery('getPrivateMsg', getPrivateMsg)
  return (
    <div className='mt-3'>
      <p className='text-[#e6eaf0] text-sm mt-2'>Direct Message</p>
      <div className='ml-4 mt-1'>
        {/* <InboxSelection name='系统通知'/> */}
        {data && data.data?.map((pm, idx) => {
          return <DirectMsgSelection key={idx} name={pm.msgTitle} to={`/home/inbox/${pm.id}`}/>
        })}
      </div>
    </div>
  )
}

function DirectMsgSelection ({ icon, name, cnt, to }) {
  return (
    <>
      <Link href={to}>
        <div className='text-gray-400 p-1 rounded-md hover:bg-[#3b3c3f] hover:cursor-pointer'>{name}</div>
      </Link>
    </>
  )
}
