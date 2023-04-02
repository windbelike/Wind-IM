import { useRouter } from 'next/router'
import ChannelDashboard from '../ChannelDashboard'

export default function ChannelRoom () {
  const router = useRouter()
  console.log(router.query)
  return (
    <ChannelDashboard>
      {router.query.id} and {router.query.roomId}
    </ChannelDashboard>
  )
}
