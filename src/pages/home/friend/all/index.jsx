import axios from 'axios'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { HomeDashboard } from 'src/pages/home/index'
import AddFriendButton from '../AddFriendButton'
import FriendCard from '../FriendCard'

async function getAllFriends () {
  const result = await axios.get('/api/friend')
  return result.data
}

export default function All () {
  const [openAddFriend, setOpenAddFriend] = useState(false)
  const { isLoading, error, data } = useQuery('getAllFriends', getAllFriends)

  return (
    <HomeDashboard>
      <div className='p-5'>
        <div className='flex'>
          <h1 className='text-white'>全部&nbsp;-&nbsp;0</h1>
          <AddFriendButton openAddFrien={openAddFriend} setOpenAddFriend={setOpenAddFriend}/>
        </div>
        {/* {openAddFriend ? <AddFriendWindow/> : ''} */}
        <div className='flex p-3 flex-wrap items-start content-start'>
          {error ? <p>{error}</p> : ''}
          {isLoading
            ? <p>Loading</p>
            : data.data?.map(friend => {
              return <FriendCard key={friend.id} email={friend.email}/>
            })
          }
        </div>
      </div>
    </HomeDashboard>
  )
}
