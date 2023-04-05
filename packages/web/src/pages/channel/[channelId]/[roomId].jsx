import { useRouter } from 'next/router'
import ChannelDashboard from '../ChannelDashboard'

export default function ChannelRoom () {
  const router = useRouter()
  return (
    <ChannelDashboard channelId={router.query.channelId}>
      {router.query.channelId} and {router.query.roomId}
    </ChannelDashboard>
  )
}
