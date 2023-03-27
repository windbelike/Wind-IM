import { useRouter } from 'next/router'
import axios from '@/utils/axiosUtils'
import { useQuery } from 'react-query'

// get channel members

// todo 整合前端API方法
// todo id undefined bug fix
async function getChannelMembers (id) {
  if (!id) {
    return {}
  }
  const params = new URLSearchParams([['id', id]])
  const result = await axios.get('/api/channel/members', {
    params
  })
  return result.data
}

export default function Channel () {
  const router = useRouter()
  const { id } = router.query
  const { data, error, isLoading } = useQuery(['getChannelMembers', id], () => getChannelMembers(id))

  return (
    <>
      <div>{id}</div>
      <div>data:{JSON.stringify(data?.data)}</div>
    </>
  )
}
