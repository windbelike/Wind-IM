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
  if (channelId == null) {
    return {}
  }
  const params = new URLSearchParams([['channelId', channelId]])
  const result = await axios.get('/api/channel', { params })
  return result.data
}

// get room list
export async function getRoomList (channelId) {
  if (channelId == null) {
    return {}
  }
  const params = new URLSearchParams([['channelId', channelId]])
  const result = await axios.get('/api/roomList', { params })
  return result.data
}

// get room info
export async function getRoomInfo (roomId) {
  if (roomId == null) {
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
export async function getChannelUserInfo (id) {
  if (id == null) {
    return {}
  }
  const params = new URLSearchParams([['id', id]])
  const result = await axios.get('/api/channel/channelUserInfo', {
    params
  })
  return result.data
}

export async function beOfflineInChannel (channelId) {
  if (channelId == null) {
    return {}
  }
  const params = new URLSearchParams([['channelId', channelId]])
  const result = await axios.get('/api/beOfflineInChannel', {
    params
  })
  return result.data
}

export async function beOnlineInChannel (channelId) {
  if (channelId == null) {
    return {}
  }
  const params = new URLSearchParams([['channelId', channelId]])
  const result = await axios.get('/api/beOnlineInChannel', {
    params
  })
  return result.data
}

export async function onlineHeartbeat () {
  try {
    const result = await axios.get('/api/onlineHeartbeat')
    return result.data
  } catch (e) {
    console.error('onlineHeartbeat error')
  }
}

export async function getFriendList () {
  const result = await axios.get('/api/friends')
  return result.data
}

export async function getOnlineFriendList () {
  const result = await axios.get('/api/onlineFriends')
  return result.data
}

export async function getPrivateMsgInfo (id) {
  if (id == null) {
    return {}
  }
  const params = new URLSearchParams([['id', id]])
  const result = await axios.get('/api/msg/privateMsg', { params })
  return result.data
}

// get inviteUrl
export async function getInviteUrl (channelId) {
  if (channelId == null) {
    return {}
  }
  const params = new URLSearchParams([['channelId', channelId]])
  const result = await axios.get('/api/channelInviteUrl', { params })
  return result.data
}
