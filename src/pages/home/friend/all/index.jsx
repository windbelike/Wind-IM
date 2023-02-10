import { useState } from 'react'
import { HomeDashboard } from 'src/pages/home/index'

export default function All () {
  const [openAddFriend, setOpenAddFriend] = useState(false)
  console.log(openAddFriend)

  return (
    <HomeDashboard>
      <div className='p-5'>
        <div className='flex'>
          <h1 className='text-white'>全部&nbsp;-&nbsp;0</h1>
          <button className='ml-5 rounded-md bg-[#6bc001] text-white px-2' onClick={() => setOpenAddFriend(true)}>添加好友</button>
        </div>
        {/* {openAddFriend ? <AddFriendWindow/> : ''} */}
        <div className='flex p-3 flex-wrap items-start content-start'>
          <FriendCard />
          <FriendCard />
          <FriendCard />
          <FriendCard />
          <FriendCard />
          <FriendCard />
          <FriendCard />
          <FriendCard />
        </div>
      </div>
    </HomeDashboard>
  )
}

function AddFriendWindow () {
  return (
    <div className='fixed w-64 h-96 mx-auto bg-white'>

    </div>
  )
}

function FriendCard () {
  return (
    <div className='flex flex-col h-32 w-72 m-3 p-4 bg-[#36383e] rounded-3xl'>
      <div className='flex items-center'>
        <div className='w-14 h-14 bg-white rounded-full'></div>
        <div><p className='ml-3 text-[#e6eaf0]'>Sawyer@gmail.com</p></div>
      </div>
      {/* 两个icon */}
    </div>
  )
}
