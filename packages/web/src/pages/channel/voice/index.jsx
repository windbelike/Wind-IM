import { useRouter } from 'next/router'
import ChannelDashboard from '../ChannelDashboard'

export default function Voice () {
  const router = useRouter()
  return (
    <ChannelDashboard channelId={router.query.channelId}>
      <div>
        Unsupported yet
      </div>
    </ChannelDashboard>
  )
}
