import { prisma } from '@/utils/prismaHolder'
import * as Boom from '@hapi/boom'
import { createDefaultRoom, roomStatus } from '../room/roomService'

const channelStatus = {
  normal: 0,
  deleted: 1
}

const channelJoinStatus = {
  notJoin: 0,
  joined: 1,
  leave: 2
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

export async function isUserOnChannel (uid, channelId) {
  const channel = await prisma.usersOnChannels.findUnique({
    where: {
      uid_channelId: {
        uid,
        channelId
      }
    }
  })

  if (!channel) {
    return false
  }

  return channel.status == channelStatus.normal
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
        status: channelStatus.normal,
        roomsRel: {
          every: {
            status: roomStatus.normal
          }
        }
      }
    },
    select: {
      uid: true,
      channelId: true,
      channelRel: {
        select: {
          id: true,
          name: true,
          roomsRel: {
            select: {
              id: true,
              name: true
            }
          }
        }
      }
    }
  })
}

// join a channel
// todo add lock
export async function joinChannel (uid, channelId) {
  if (!uid || !channelId) {
    throw Boom.badRequest('Illegal params.')
  }
  if (!Number.isInteger(channelId)) {
    throw Boom.badRequest('Illegal channelId.')
  }

  const channel = await prisma.channel.findUnique({
    where: {
      id: channelId
    }
  })
  if (channel == null || channel.status != channelStatus.normal) {
    throw Boom.badRequest('No such channel.')
  }

  const joinStatus = await checkUserJoinChannelStatus(uid, channelId)

  if (joinStatus == channelJoinStatus.notJoin) {
    // first join
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

  if (joinStatus == channelJoinStatus.joined) {
    // already joined
    throw Boom.badRequest('Already joined this channel.')
  } else if (joinStatus == channelJoinStatus.leave) {
    // join this channel again
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

// check if a user is in a channel
export async function checkUserInChannel (uid, channelId) {
  if (isNaN(channelId) || isNaN(uid)) {
    return false
  }
  const status = await checkUserJoinChannelStatus(uid, channelId)
  return status == channelJoinStatus.joined
}

// check user's join status of a channel
export async function checkUserJoinChannelStatus (uid, channelId) {
  if (isNaN(channelId) || isNaN(uid)) {
    return channelJoinStatus
  }
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

  if (usersOnChannels == null) {
    // haven't join status
    return channelJoinStatus.notJoin
  } else {
    if (usersOnChannels.status == channelStatus.normal) {
      // joined status
      return channelJoinStatus.joined
    } else if (usersOnChannels.status == channelStatus.deleted) {
      // leave status
      return channelJoinStatus.leave
    } else {
      // unknown status
      return channelJoinStatus.notJoin
    }
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
