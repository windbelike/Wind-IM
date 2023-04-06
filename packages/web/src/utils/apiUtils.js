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

export async function getChannelInfo (channelId) {
  if (!channelId) {
    return {}
  }
  const params = new URLSearchParams([['channelId', channelId]])
  const result = await axios.get('/api/channel', { params })
  return result.data
}

// get room list
export async function getRoomList (channelId) {
  if (!channelId) {
    return {}
  }
  const params = new URLSearchParams([['channelId', channelId]])
  const result = await axios.get('/api/roomList', { params })
  return result.data
}

// get room info
export async function getRoomInfo (roomId) {
  if (!roomId) {
    return {}
  }
  const params = new URLSearchParams([['roomId', roomId]])
  const result = await axios.get('/api/room', { params })
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

// get channel members
export async function getChannelMembers (id) {
  if (!id) {
    return {}
  }
  const params = new URLSearchParams([['id', id]])
  const result = await axios.get('/api/channel/members', {
    params
  })
  return result.data
}
