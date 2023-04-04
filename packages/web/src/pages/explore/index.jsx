import { getChannelList } from '@/utils/apiUtils'
import axios from '@/utils/axiosUtils'
import { useQuery } from 'react-query'

// get all channel list

// todo implement this

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
