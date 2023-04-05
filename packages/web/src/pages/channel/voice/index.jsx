import { useRouter } from 'next/router'
import ChannelLayout from '../ChannelLayout'

export default function Voice () {
  const router = useRouter()
  return (
    <ChannelLayout channelId={router.query.channelId}>
      <div>
        Unsupported yet
      </div>
    </ChannelLayout>
  )
}
