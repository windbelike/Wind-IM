import axios from 'axios'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { HomeDashboard } from '../..'
import AddFriendButton from '../AddFriendButton'
import FriendCard from '../FriendCard'

async function getOnlineFriends ({ email, pwd }) {
  const result = await axios.get('/api/friend')
  return result.data
}

export default function Online () {
  const [openAddFriend, setOpenAddFriend] = useState(false)
  const { isLoading, error, data } = useQuery('getOnlineFriends', getOnlineFriends)

  return (
    <HomeDashboard>
      <div className='p-5'>
        <div className='flex'>
          <h1 className='text-white'>在线&nbsp;-&nbsp;0</h1>
          <AddFriendButton openAddFrien={openAddFriend} setOpenAddFriend={setOpenAddFriend}/>
        </div>
        {/* {openAddFriend ? <AddFriendWindow/> : ''} */}
        <div className='flex p-3 flex-wrap items-start content-start'>
          {data?.data?.map(friend => {
            return <FriendCard key={friend.id} email={friend.email}/>
          })}
        </div>
      </div>
      {/* {JSON.stringify(data.data)} */}
    </HomeDashboard>
  )
}
