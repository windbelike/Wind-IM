import axios from 'axios'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { HomeDashboard } from '../..'
import AddFriendButton from '../AddFriendButton'
import AddFriendWindow from '../AddFriendWindow'
import FriendCard from '../FriendCard'

async function getOnlineFriends () {
  const result = await axios.get('/api/friend')
  return result.data
}

export default function Online () {
  const [openAddFriendWindow, setOpenAddFriendWindow] = useState(false)
  const { isLoading, error, data } = useQuery('getAllFriends', getOnlineFriends)

  return (
    <HomeDashboard>
      <div className='p-5'>
        <div className='flex'>
          <h1 className='text-white'>在线&nbsp;-&nbsp;0</h1>
          <AddFriendButton setOpenAddFriendWindow={setOpenAddFriendWindow}/>
        </div>

        {openAddFriendWindow
          ? <AddFriendWindow openAddFriendWindow={openAddFriendWindow} setOpenAddFriendWindow={setOpenAddFriendWindow}/>
          : ''
        }

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
