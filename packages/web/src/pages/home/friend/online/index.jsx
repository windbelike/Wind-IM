import { useState } from 'react'
import { useQuery } from 'react-query'
import HomeLayout from '../../HomeLayout'
import AddFriendButton from '../AddFriendButton'
import AddFriendWindow from '../AddFriendWindow'
import FriendCard from '../FriendCard'
import axios from '@/utils/axiosUtils'
import Layout from '@/pages/Layout'

async function getOnlineFriends () {
  const result = await axios.get('/api/friend')
  return result.data
}

export default function Online () {
  const [openAddFriendWindow, setOpenAddFriendWindow] = useState(false)
  const { isLoading, error, data } = useQuery('getAllFriends', getOnlineFriends)

  return (
    <div className='p-5'>
      <div className='flex'>
        <h1 className='text-white'>Online&nbsp;-&nbsp;{data ? data.data?.length : 0}</h1>
        <AddFriendButton setOpenAddFriendWindow={setOpenAddFriendWindow}/>
      </div>

      {openAddFriendWindow
        ? <AddFriendWindow openAddFriendWindow={openAddFriendWindow} setOpenAddFriendWindow={setOpenAddFriendWindow}/>
        : ''
      }

      <div className='flex p-3 flex-wrap items-start content-start'>
        {error ? <p>Error</p> : ''}
        {isLoading && <p>Loading</p>
        }
        {data && data.data?.map((rel, idx) => {
          return <FriendCard key={idx} usernameAndTag={`${rel.friendRel?.username}#${rel.friendRel?.tag}`}/>
        })}
      </div>
    </div>
  )
}

Online.getLayout = function getLayout (page) {
  return (
    <Layout>
      <HomeLayout>{page}</HomeLayout>
    </Layout>
  )
}
