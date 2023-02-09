import { useState } from 'react'
import { HomeDashboard } from '../..'

export default function Online () {
  const [openAddFriend, setOpenAddFriend] = useState(false)
  console.log(openAddFriend)

  return (
    <HomeDashboard>
      <div className='p-5'>
        <div className='flex w-full'>
          <h1 className='text-white'>在线&nbsp;-&nbsp;0</h1>
          <button className='ml-5 rounded-md bg-[#6bc001] text-white px-2' onClick={() => setOpenAddFriend(true)}>添加好友</button>
        </div>
        {/* {openAddFriend ? <AddFriendWindow/> : ''} */}
        <div className='flex w-full h-full p-5 flex-wrap'>
          <div className='h-36 w-64 m-3 bg-[#36383e] rounded-lg'></div>
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
