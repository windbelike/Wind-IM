import { useRouter } from 'next/router'
import axios from '@/utils/axiosUtils'
import { useQuery } from 'react-query'

// get channel members

async function getChannelMembers ({ id }) {
  const params = new URLSearchParams([['id', id]])
  const result = await axios.get('/api/channel/members', {
    params
  })
  return result.data
}

export default function Channel () {
  const router = useRouter()
  const { id } = router.query
  const { data, error, isLoading } = useQuery('getChannelMembers', () => getChannelMembers(id))
  console.log(data?.data)

  return (
    <>
      <div>{id}</div>
    </>
  )
}
