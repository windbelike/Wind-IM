import Layout from '@/pages/Layout'
import { useRouter } from 'next/router'
import ChannelLayout from '../ChannelLayout'

export default function Voice () {
  const router = useRouter()
  return (
    <div>
        Unsupported yet
    </div>
  )
}

Voice.getLayout = function getLayout (page) {
  const router = useRouter()
  return (
    <Layout>
      <ChannelLayout channelId={router.query.channelId}>{page}</ChannelLayout>
    </Layout>
  )
}
