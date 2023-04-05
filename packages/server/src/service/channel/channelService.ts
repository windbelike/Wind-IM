import { prisma } from '@/utils/prismaHolder'
import * as Boom from '@hapi/boom'
import { createDefaultRoom } from '../room/roomService'

const channelStatus = {
  normal: 0,
  deleted: 1
}

// 查询channel
export async function selectChannelById (id) {
  return await prisma.channel.findUnique({
    where: {
      id
    }
  })
}

// 获取Channel的所有成员
export async function getChannelMembers (channelId) {
  // todo 添加查询权限控制 & 校验参数
  return await prisma.usersOnChannels.findMany({
    where: {
      channelId,
      status: channelStatus.normal
    },
    include: {
      userRel: {
        select: {
          username: true
        }
      }
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
      channelRel: {
        status: channelStatus.normal
      }
    },
    include: {
      channelRel: true
    }
  })
}

// join a channel
// todo add lock
export async function joinChannel (uid, channelId) {
  if (!uid || !channelId) {
    throw Boom.badRequest('Illegal params.')
  }
  // 检查channelId为整数
  if (!Number.isInteger(channelId)) {
    throw Boom.badRequest('Illegal channelId.')
  }

  const channel = await prisma.channel.findUnique({
    where: {
      id: channelId
    }
  })
  if (!channel || channel.status != channelStatus.normal) {
    // 不存在此Channel
    throw Boom.badRequest('No such channel.')
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

// delete channel
export async function deleteChannel (channelId) {
  // check if channel exists
  const channel = selectChannelById(channelId)
  if (!channel) {
    throw Boom.badRequest('Channel not exist.')
  }

  return await prisma.channel.update({
    where: {
      id: channelId
    },
    data: {
      status: channelStatus.deleted
    }
  })
}

// create a channel, join thi channel, and then create a default room associated with it
export async function createChannel (uid, name, desc) {
  if (!uid || !name || !name.trim()) {
    throw Boom.badRequest('Illegal params.')
  }

  const channel = await prisma.channel.create({
    data: {
      name,
      desc,
      ownerUidRel: {
        connect: { id: uid }
      },
      status: channelStatus.normal
    },
    select: {
      id: true
    }
  })

  const joinChannelResult = await joinChannel(uid, channel.id)
  if (!joinChannelResult) {
    console.error('joinChannel failed, but channel created. channel id: ' + channel.id)
  }

  // create a default room
  const createDefaultRoomResult = await createDefaultRoom({ creatorId: uid, channelId: channel.id })
  if (!createDefaultRoomResult) {
    console.error('createDefaultRoom failed, but channel created. channel id: ' + channel.id)
  }

  return channel
}
