// import { HomeDashboard } from 'src/pages/home/index'
import axios from 'axios'
import { useState } from 'react'
import { useQuery } from 'react-query'
import { HomeDashboard } from '../..'
import AddFriendButton from '../AddFriendButton'
import AddFriendWindow from '../AddFriendWindow'
import FriendReqCard from '../FriendReqCard'

async function getFriendRequests () {
  const result = await axios.get('/api/friendRequest')
  return result.data
}

export default function Request () {
  const [openAddFriendWindow, setOpenAddFriendWindow] = useState(false)
  const { isLoading, error, data } = useQuery('friendRequest', getFriendRequests)

  return (
    <HomeDashboard>
      <div className='p-5'>
        <div className='flex'>
          <h1 className='text-white'>请求&nbsp;-&nbsp;0</h1>
          <AddFriendButton setOpenAddFriendWindow={setOpenAddFriendWindow}/>
        </div>

        {openAddFriendWindow &&
          <AddFriendWindow openAddFriendWindow={openAddFriendWindow} setOpenAddFriendWindow={setOpenAddFriendWindow}/>
        }

        <div className='flex p-3 flex-wrap items-start content-start'>
          {error && <p>{error}</p>}
          {isLoading && <p>Loading</p>}
          {data && data.data?.map(friendReq => {
            return <FriendReqCard key={friendReq.id} friendReq={friendReq}/>
          })}
        </div>
      </div>
    </HomeDashboard>
  )
}
