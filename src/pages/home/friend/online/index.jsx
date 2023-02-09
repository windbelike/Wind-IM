import { useState } from 'react'
import { HomeDashboard } from '../..'
// import { HomeDashboard } from 'src/pages/home/index'

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
        <div className='bg-white'>

        </div>
      </div>
    </HomeDashboard>
  )
}
