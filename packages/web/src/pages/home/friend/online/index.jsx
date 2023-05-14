import { useState } from 'react'
import { useQuery } from 'react-query'
import HomeLayout from '../../HomeLayout'
import AddFriendButton from '../AddFriendButton'
import AddFriendWindow from '../AddFriendWindow'
import FriendCard from '../FriendCard'
import Layout from '@/pages/Layout'
import { getOnlineFriendList } from '@/utils/apiUtils'

export default function Online () {
  const [openAddFriendWindow, setOpenAddFriendWindow] = useState(false)
  const { isLoading, error, data } = useQuery('getAllFriends', getOnlineFriendList)

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
        {data && data.data?.map((item, idx) => {
          const usernameAndTag = `${item.friendRel?.username}#${item.friendRel?.tag}`
          return <FriendCard key={idx} usernameAndTag={usernameAndTag} online={item.friendRel.online}/>
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
