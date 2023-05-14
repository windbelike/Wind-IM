
import { statusPass, statusPending, statusRefuse } from '@/utils/friend-enums'
import * as Boom from '@hapi/boom'
import { prisma } from '@/utils/prismaHolder'
import { batchCheckUserOnline } from '../user/userService'

// todo 限制好友数量
// todo 限制输入长度
// todo 限制邮箱格式

// 在线状态设计：1分钟发一个心跳包，redis记录用户心跳时间。业务层判断心跳时间晚于当前时间2分钟，则离线

interface friendListItemType {
  uid?: number
  friendId?: number
  alias?: string
  friendRel?: {
    id?: number
    email?: string
    bio?: string
    username?: string
    tag?: string
    online?: boolean
  }
}

export function isReqStatusValid (status) {
  return status == statusPass || status == statusRefuse
}

export async function getUserByUsernameAndTag (username:string, tag:string) {
  if (!username || !tag) {
    return
  }

  return await prisma.user.findUnique({
    select: {
      id: true,
      username: true,
      tag: true
    },
    where: {
      usernameAndTagIdx: {
        username,
        tag
      }
    }
  })
}

export async function getUserByEmail (email) {
  if (email == null || email == undefined) {
    return
  }
  return await prisma.user.findUnique({
    select: {
      id: true,
      email: true
    },
    where: {
      email
    }
  })
}

export async function getAllOnlineFriend (uid) {
  // todo db获取好友列表
  // todo redis获取在线好友
  console.log('Not supported')
}

export async function selectFriendList (uid) {
  return await prisma.friend.findMany({
    where: {
      uid
    },
    include: {
      friendRel: {
        select: {
          id: true,
          email: true,
          bio: true,
          username: true,
          tag: true
        }
      }
    }
  })
}

export async function getFriendList (uid) {
  const result = []
  if (uid == null) {
    return result
  }
  const friendListData = await selectFriendList(uid)
  const friendIdList = friendListData.map(friend => friend.friendId)
  const onlineFriendIdList = await batchCheckUserOnline(friendIdList)
  friendListData.forEach(item => {
    const isFriendOnline = onlineFriendIdList.includes(item.friendId)
    const resultItem: friendListItemType = { ...item }
    resultItem.friendRel.online = isFriendOnline
    result.push(resultItem)
  })

  return result
}

export async function getOnlineFriendList (uid) {
  const result = []
  if (uid == null) {
    return result
  }
  const friendList = await getFriendList(uid)
  if (friendList == null || friendList.length == 0) {
    return result
  }
  return friendList.filter(item => item.friendRel.online)
}

export async function checkIsFriends (uid, friendId) {
  // check if you were friends.
  try {
    const relationOfUser = await prisma.friend.findUnique({
      where: {
        uid_friendId: {
          uid,
          friendId
        }
      }
    })
    const relationOfFriend = await prisma.friend.findUnique({
      where: {
        uid_friendId: {
          uid: friendId,
          friendId: uid
        }
      }
    })
    if (relationOfUser && relationOfFriend && relationOfUser.status == statusPass && relationOfFriend.status == statusPass) {
      return true
    }
  } catch (e) {
    console.error(e)
  }

  return false
}

// 删除好友
export async function breakFriends (uid, friendId) {
  if (!uid || !friendId || friendId == uid) {
    return Boom.badRequest('Illegal params.')
  }
  return Boom.badRequest('Unsupported fn.')
}

// 添加好友
export async function makeFriends (reqId, uid, friendId) {
  if (!reqId || !uid || !friendId || friendId == uid) {
    throw Boom.badRequest('Illegal params.')
  }

  // check if you were friends.
  if (await checkIsFriends(uid, friendId)) {
    throw Boom.badRequest('Already friends.')
  }

  // update both users' friend relations
  const createFriendForUser = prisma.friend.create({
    data: {
      userRel: {
        connect: { id: uid }
      },
      friendRel: {
        connect: { id: friendId }
      }
    }
  })

  const createFriendForFriend = prisma.friend.create({
    data: {
      userRel: {
        connect: { id: friendId }
      },
      friendRel: {
        connect: { id: uid }
      }
    }
  })

  // update friendRequest
  const updateFriendReq = prisma.friendRequest.update({
    where: {
      id: reqId
    },
    data: {
      status: statusPass
    }
  })
  if (createFriendForUser && createFriendForFriend && updateFriendReq) {
    try {
      const txn = await prisma.$transaction([
        createFriendForUser,
        createFriendForFriend,
        updateFriendReq
      ])
      return { code: 0 }
    } catch (e) {
      console.log(e)
      return { error: e }
    }
  }
}
