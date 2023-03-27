import { useRouter } from 'next/router'
import axios from '@/utils/axiosUtils'
import { useQuery } from 'react-query'

// get channel members

// todo id undefined bug fix
async function getChannelMembers (id) {
  console.log('getChannelMembers id:' + id)
  const params = new URLSearchParams([['id', 1]])
  const result = await axios.get('/api/channel/members', {
    params
  })
  return result.data
}

export default function Channel () {
  const router = useRouter()
  const { id } = router.query
  console.log('Channel, id:' + id)
  const { data, error, isLoading } = useQuery('getChannelMembers', () => getChannelMembers(id))
  console.log(data?.data)

  return (
    <>
      <div>{id}</div>
    </>
  )
}
