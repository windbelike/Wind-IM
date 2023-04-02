import axios from '@/utils/axiosUtils'

export async function getWhoami () {
  const result = await axios.get('/api/whoami')
  return result.data
}

export async function getPrivateMsg () {
  const result = await axios.get('/api/msg/privateMsgList')
  return result.data
}
