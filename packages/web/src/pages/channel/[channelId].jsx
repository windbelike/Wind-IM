import { useRouter } from 'next/router'
import ChannelLayout from './ChannelLayout'
import Layout from '../Layout'

Channel.getLayout = function getLayout (page) {
  const router = useRouter()
  return (
    <Layout>
      <ChannelLayout channelId={router.query.channelId}>{page}</ChannelLayout>
    </Layout>
  )
}

export default function Channel () {
  return (
    <></>
  )
}
