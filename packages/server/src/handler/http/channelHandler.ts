import { checkUserInChannel, createChannel, deleteChannel, generateInviteUrl, getChannelListByUid, getChannelMembers, isUserOnChannel, joinChannel, selectChannelById } from '@/service/channel/channelService'
import { becomeOfflineInChannel, becomeOnlineInChannel, getChannelOnlineInfo as getChannelOnlineMembers } from '@/service/user/userService'
import * as Boom from '@hapi/boom'

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
export async function channelUserInfo (req, res, next) {
  try {
    console.log('channelMembersGet req:' + JSON.stringify(req.query))
    const user = req.windImUser
    const channelId = parseInt(req.query?.id)
    const isUserInChannel = await checkUserInChannel(user.id, channelId)
    if (!isUserInChannel) {
      throw Boom.badRequest('You are not in this channel.')
    }
    if (isNaN(channelId)) {
      throw Boom.badRequest('Invalid params error')
    }
    const members = await getChannelMembers(channelId)
    const onlineMembers = await getChannelOnlineMembers(channelId)
    const membersResult = []
    members.map((member) => {
      const online = onlineMembers.includes(member.uid.toString())
      membersResult.push({ ...member, online })
      return member
    })

    const onlineUserCnt = onlineMembers.length
    const offlineUserCnt = members.length - onlineUserCnt

    res.json({ code: 0, data: { members: membersResult, onlineUserCnt, offlineUserCnt } })
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

export async function beOnlineInChannel (req, res, next) {
  try {
    const channelId = parseInt(req.query?.channelId)
    if (!channelId) {
      throw Boom.badRequest('Invalid params error')
    }
    const user = req.windImUser
    if (!isUserOnChannel(user.id, channelId)) {
      throw Boom.badRequest('You have not joined this channel yet')
    }
    becomeOnlineInChannel(user.id, channelId)
    res.json({ code: 0, data: 'beOnlineInChannel' })
  } catch (e) {
    next(e)
  }
}

export async function beOfflineInChannel (req, res, next) {
  try {
    const channelId = parseInt(req.query?.channelId)
    if (!channelId) {
      throw Boom.badRequest('Invalid params error')
    }
    const user = req.windImUser
    becomeOfflineInChannel(user.id, channelId)
    res.json({ code: 0, data: 'beOfflineInChannel' })
  } catch (e) {
    next(e)
  }
}

export async function channelInviteGet (req, res, next) {
  try {
    const user = req.windImUser
    const channelId = parseInt(req.query?.channelId)
    const inviteUrl = await generateInviteUrl(user.id, channelId)
    res.json({ code: 0, data: { inviteUrl } })
  } catch (e) {
    next(e)
  }
}
