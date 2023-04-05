import { getChannelList } from '@/utils/apiUtils'
import axios from '@/utils/axiosUtils'
import { useQuery } from 'react-query'
import Layout from '../Layout'

// get all channel list

// todo implement this

Explore.getLayout = function getLayout (page) {
  console.log('Home.getLayout')
  return (
    <Layout>
      {page}
    </Layout>
  )
}

export default function Explore () {
  const { data, error, isLoading } = useQuery('getChannelList', getChannelList)
  console.log(data?.data)

  return (
    <>
      {data?.data?.map((channel) => {
        return (
          <div key={channel.channelId}>
            {channel.channelRel.name}
          </div>
        )
      })}
    </>
  )
}
