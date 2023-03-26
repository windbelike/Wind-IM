import { prisma } from '@/utils/prismaHolder'
import * as Boom from '@hapi/boom'

const channelStatus = {
  normal: 0,
  deleted: 1
}

export async function selectChannelById (id) {
  return await prisma.channel.findUnique({
    where: {
      id
    }
  })
}

// 离开channel
export async function leaveChannel (uid, channelId) {
  const channel = await prisma.usersOnChannels.findUnique({
    where: {
      uid_channelId: {
        uid,
        channelId
      }
    },
    include: {
      channelRel: true
    }
  })

  if (!channel) {
    return Boom.badRequest('Not in channel.')
  }

  if (channel.status == channelStatus.deleted) {
    return Boom.badRequest('Channel already deleted.')
  }

  const deleteRes = await prisma.usersOnChannels.update({
    where: {
      uid_channelId: {
        uid,
        channelId
      }
    },
    data: {
      status: channelStatus.deleted
    }
  })

  return deleteRes
}

// 获取用户所在的channel列表
export async function getChannelListByUid (uid) {
  return await prisma.usersOnChannels.findMany({
    where: {
      uid,
      status: channelStatus.normal
    },
    include: {
      channelRel: true
    }
  })
}

// 加入Channel
export async function joinChannel (uid, channelId) {
  return await prisma.usersOnChannels.create({
    data: {
      userRel: {
        connect: { id: uid }
      },
      channelRel: {
        connect: { id: channelId }
      },
      status: channelStatus.normal
    }
  })
}

// create channel
export async function createChannel (uid, name, desc) {
  if (!uid || !name || !name.trim()) {
    return Boom.badRequest('Illegal params.')
  }

  const channel = await prisma.channel.create({
    data: {
      name,
      desc,
      ownerUidRel: {
        connect: { id: uid }
      },
      status: channelStatus.normal
    }
  })

  await joinChannel(uid, channel.id)

  return channel
}
