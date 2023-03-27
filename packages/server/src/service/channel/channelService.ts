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
    throw Boom.badRequest('Not in channel.')
  }

  if (channel.status == channelStatus.deleted) {
    throw Boom.badRequest('Channel already deleted.')
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
// todo 加锁
export async function joinChannel (uid, channelId) {
  // 检查入参
  if (!uid || !channelId) {
    throw Boom.badRequest('Illegal params.')
  }
  // 检查channelId为整数
  if (!Number.isInteger(channelId)) {
    throw Boom.badRequest('Illegal channelId.')
  }

  // 检查Channel存在
  const channel = await prisma.channel.findUnique({
    where: {
      id: channelId
    }
  })
  if (!channel) {
    // 不存在此Channel
    throw Boom.badRequest('Channel not exist.')
  }

  // 检查是否已经加入
  const usersOnChannels = await prisma.usersOnChannels.findUnique({
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

  if (!usersOnChannels) {
    // 第一次加入
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

  if (usersOnChannels.status == channelStatus.normal) {
    // 已经加入
    throw Boom.badRequest('Already in channel.')
  } else if (usersOnChannels.status == channelStatus.deleted) {
    // 加入过，但已经离开
    return await prisma.usersOnChannels.update({
      where: {
        uid_channelId: {
          uid,
          channelId
        }
      },
      data: {
        status: channelStatus.normal
      }
    })
  }
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
