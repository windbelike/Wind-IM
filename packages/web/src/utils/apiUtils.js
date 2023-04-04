import axios from '@/utils/axiosUtils'

export async function getWhoami () {
  const result = await axios.get('/api/whoami')
  return result.data
}

export async function getPrivateMsg () {
  const result = await axios.get('/api/msg/privateMsgList')
  return result.data
}

export async function getChannelList () {
  const result = await axios.get('/api/channelList')
  return result.data
}

// get room list
export async function getRoomList () {
  const result = await axios.get('/api/roomList')
  return result.data
}

// delete channel
export async function deleteChannel ({ channelId }) {
  const result = await axios.post('/api/channel/delete', { channelId })
  return result.data
}
// leave channel
export async function leaveChannel ({ channelId }) {
  const result = await axios.post('/api/channel/leave', { channelId })
  return result.data
}
