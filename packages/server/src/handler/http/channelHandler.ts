import { createChannel, deleteChannel, getChannelListByUid, getChannelMembers, isUserOnChannel, joinChannel, selectChannelById } from '@/service/channel/channelService'
import * as Boom from '@hapi/boom'
import { redis } from 'utils/redisHolder'

// get channel info
export async function channelGet (req, res, next) {
  try {
    const user = req.windImUser
    const channel = await selectChannelById(parseInt(req.query?.channelId))
    res.json(
      { code: 0, message: 'succeed', data: channel }
    )
  } catch (e) {
    next(e)
  }
}

// create channel
export async function channelPost (req, res, next) {
  try {
    const user = req.windImUser
    const body = req.body
    const channel = await createChannel(user.id, body.name, body.desc)
    if (channel) {
      res.json({ code: 0, message: 'succeed', data: { channelId: channel.id } })
    } else {
      res.json({ code: 1, message: 'error' })
    }
  } catch (e) {
    next(e)
  }
}

export async function channelJoinPost (req, res, next) {
  try {
    const user = req.windImUser
    const body = req.body
    // channelId to integer
    const channel = await joinChannel(user.id, parseInt(body.channelId))
    if (channel) {
      res.json({ code: 0, message: 'succeed' })
    } else {
      res.json({ code: 1, message: 'error' })
    }
  } catch (e) {
    next(e)
  }
}

// get all channel I joined info
export async function channelListGet (req, res, next) {
  try {
    const user = req.windImUser
    const body = req.body
    const result = await getChannelListByUid(user.id)
    console.log('#channelListGet channelList' + JSON.stringify(result))
    res.json({ data: result })
  } catch (e) {
    next(e)
  }
}

// get all crew by channelId
export async function channelMembersGet (req, res, next) {
  try {
    console.log('channelMembersGet req:' + JSON.stringify(req.query))
    const user = req.windImUser
    const channelId = parseInt(req.query?.id)
    // 校验channelId为Integer
    if (isNaN(channelId)) {
      throw Boom.badRequest('Invalid params error')
    }

    res.json({ data: await getChannelMembers(channelId) })
  } catch (e) {
    next(e)
  }
}

// delete channel
export async function channelDelete (req, res, next) {
  try {
    const user = req.windImUser
    const body = req.body
    const channel = await selectChannelById(parseInt(body.channelId))
    if (!channel) {
      throw Boom.badRequest('Channel not exist.')
    }
    if (channel.ownerUid != user.id) {
      throw Boom.badRequest('You are not the owner of this channel.')
    }

    const channelDeleted = await deleteChannel(parseInt(body.channelId))
    console.log('#channelDelete deleted channelId:' + body.channelId)
    if (channelDeleted) {
      res.json({ code: 0, message: 'succeed' })
    } else {
      res.json({ code: 1, message: 'error' })
    }
  } catch (e) {
    next(e)
  }
}

export async function joinChannelNotify (req, res, next) {
  try {
    const channelId = parseInt(req.query?.id)
    if (!channelId) {
      throw Boom.badRequest('Invalid params error')
    }
    const user = req.windImUser
    if (!isUserOnChannel(channelId, user)) {
      throw Boom.badRequest('You have not joined this channel yet')
    }
    const channelOnlineUsersKey = buildChannelOnlineUserskey(channelId)
    redis.sadd(channelOnlineUsersKey, user.id)
    res.json({ code: 0, data: 'joinChannelNotify' })
  } catch (e) {
    next(e)
  }
}

export async function leaveChannelNotify (req, res, next) {
  try {
    const channelId = parseInt(req.query?.id)
    if (!channelId) {
      throw Boom.badRequest('Invalid params error')
    }
    const user = req.windImUser
    const channelOnlineUsersKey = buildChannelOnlineUserskey(channelId)
    redis.srem(channelOnlineUsersKey, user.id)
    res.json({ code: 0, data: 'leaveChannelNotify' })
  } catch (e) {
    next(e)
  }
}

export async function channelOnlineUsers (req, res, next) {
  try {
    const channelId = parseInt(req.query?.id)
    if (!channelId) {
      throw Boom.badRequest('Invalid params error')
    }
    const channelOnlineUsersKey = buildChannelOnlineUserskey(channelId)
    const elementCount = await redis.scard(channelOnlineUsersKey) // get element count of a set
    const onlineUsers = await redis.smembers(channelOnlineUsersKey)
    res.json({ code: 0, data: { cnt: elementCount, onlineUsers } })
  } catch (e) {
    next(e)
  }
}

function buildChannelOnlineUserskey (channelId: number) {
  return `channel-${channelId}-onlineUsers`
}
