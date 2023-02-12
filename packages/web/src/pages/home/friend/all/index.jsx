import axios from 'axios'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { HomeDashboard } from 'src/pages/home/index'
import AddFriendButton from '../AddFriendButton'
import AddFriendWindow from '../AddFriendWindow'
import FriendCard from '../FriendCard'

async function getAllFriends () {
  const result = await axios.get('/api/friend')
  return result.data
}

export default function All () {
  const [openAddFriendWindow, setOpenAddFriendWindow] = useState(false)
  const { isLoading, error, data } = useQuery('getAllFriends', getAllFriends)

  return (
    <HomeDashboard>
      <div className='p-5'>
        <div className='flex'>
          <h1 className='text-white'>全部&nbsp;-&nbsp;0</h1>
          <AddFriendButton setOpenAddFriendWindow={setOpenAddFriendWindow}/>
        </div>

        {openAddFriendWindow
          ? <AddFriendWindow openAddFriendWindow={openAddFriendWindow} setOpenAddFriendWindow={setOpenAddFriendWindow}/>
          : ''
        }

        <div className='flex p-3 flex-wrap items-start content-start'>
          {error ? <p>{error}</p> : ''}
          {isLoading && <p>Loading</p>
          }
          {data && data.data?.map((rel, idx) => {
            return <FriendCard key={idx} email={rel.friendRel?.email}/>
          })}
        </div>
      </div>
    </HomeDashboard>
  )
}
