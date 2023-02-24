import Link from 'next/link'
import { useState } from 'react'
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
      <InboxPanel />
    </div>
  )
}

function UserInfoPanel () {
  const { isLoading, data, error } = useQuery('getWhoami', getWhoami)
  return (
    <div className="">
      {isLoading && <p className="text-[#e6eaf0] font-bold">Anonymous</p>}
      {data && <p className="text-[#e6eaf0] font-bold">{data.data?.username}</p>}
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
        <FriendSelection name='Pending' to='/home/friend/request'/>
      </div>
    </div>
  )
}

function FriendSelection ({ icon, name, cnt, to }) {
  return (
    <>
      <Link href={to}>
        <div className='text-gray-400 p-1 rounded-md hover:bg-gray-200 hover:cursor-pointer'>{name}</div>
      </Link>
    </>
  )
}

async function getPrivateMsg () {
  const result = await axios.get('/api/msg/privateMsg')
  return result.data
}
function InboxPanel () {
  const { error, isLoading, data } = useQuery('getPrivateMsg', getPrivateMsg)
  return (
    <div className='mt-3'>
      <p className='text-[#e6eaf0] text-sm mt-2'>Direct Message</p>
      <div className='ml-4 mt-1'>
        {/* <InboxSelection name='系统通知'/> */}
        {data && data.data?.map((pm, idx) => {
          return <InboxSelection key={idx} name={pm.msgTitle} to={`/home/inbox/${pm.id}`}/>
        })}
      </div>
    </div>
  )
}

function InboxSelection ({ icon, name, cnt, to }) {
  return (
    <>
      <Link href={to}>
        <div className='text-gray-400 p-1 rounded-md hover:bg-gray-200 hover:cursor-pointer'>{name}</div>
      </Link>
    </>
  )
}
