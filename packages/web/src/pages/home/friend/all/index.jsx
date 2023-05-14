import { useState } from 'react'
import { useQuery } from 'react-query'
import HomeLayout from '../../HomeLayout'
import AddFriendButton from '../AddFriendButton'
import AddFriendWindow from '../AddFriendWindow'
import FriendCard from '../FriendCard'
import Layout from '@/pages/Layout'
import { getFriendList } from '@/utils/apiUtils'

All.getLayout = function getLayout (page) {
  return (
    <Layout>
      <HomeLayout>{page}</HomeLayout>
    </Layout>
  )
}

export default function All ({ sideBarActiveState }) {
  console.log('sideBarActiveState:' + sideBarActiveState)
  const [openAddFriendWindow, setOpenAddFriendWindow] = useState(false)
  const { isLoading, error, data } = useQuery('getAllFriends', getFriendList)

  return (
    <div className='p-5'>
      <div className='flex'>
        <h1 className='text-white'>ALL&nbsp;-&nbsp;{data ? data.data?.length : 0}</h1>
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
