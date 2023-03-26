import axios from '@/utils/axiosUtils'
import { useQuery } from 'react-query'

// 获取用户所在Channel列表

async function getChannels () {
  const result = await axios.get('/api/channel')
  return result.data
}

export default function ChannelHome () {
  const { data, error, isLoading } = useQuery('getChannels', getChannels)
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
