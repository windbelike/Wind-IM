import axios from 'axios'
import Link from 'next/link'
import { useState } from 'react'
import { useQuery } from 'react-query'

export default function HomeSideBar () {
  useState(0)
  return (
    <div className="p-2 shrink-0 flex flex-col h-full w-64 border-r-[1px] border-solid border-r-[#323437] overflow-y-hidden">
      <UserInfoPanel />
      <FriendPanel />
      <InboxPanel />
    </div>
  )
}

function UserInfoPanel () {
  return (
    <div className=""><p className="text-[#e6eaf0] font-bold">Sawyer</p></div>
  )
}

function FriendPanel () {
  return (
    <div className='mt-3'>
      <p className='text-[#e6eaf0] text-sm mt-2'>好友</p>
      <div className='ml-4 mt-1'>
        <FriendSelection name='在线' to='/home/friend/online'/>
        <FriendSelection name='全部' to='/home/friend/all'/>
        <FriendSelection name='请求' to='/home/friend/request'/>
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
      <p className='text-[#e6eaf0] text-sm mt-2'>收件箱</p>
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
