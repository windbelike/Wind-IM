import Layout from '@/pages/Layout'
import { useRouter } from 'next/router'
import ChannelLayout from '../ChannelLayout'

export default function ChannelRoom () {
  const router = useRouter()
  return (
    <div>
      {router.query.channelId} and {router.query.roomId}
    </div>
  )
}

ChannelRoom.getLayout = function getLayout (page) {
  const router = useRouter()
  return (
    <Layout>
      <ChannelLayout channelId={router.query.channelId}>{page}</ChannelLayout>
    </Layout>
  )
}
