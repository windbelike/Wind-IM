import { useState } from 'react'
import { useQuery } from 'react-query'
import HomeDashboard from '../../HomeDashboard'
import AddFriendButton from '../AddFriendButton'
import AddFriendWindow from '../AddFriendWindow'
import FriendCard from '../FriendCard'
import axios from '@/utils/axiosUtils'

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
          <h1 className='text-white'>Online&nbsp;-&nbsp;0</h1>
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
