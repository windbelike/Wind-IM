
import { prisma } from 'src/utils/server-utils'
import { statusPass, statusPending, statusRefuse } from 'src/utils/friend-enums'
import { Boom } from '@hapi/boom'

// 在线状态设计：1分钟发一个心跳包，redis记录用户心跳时间。业务层判断心跳时间晚于当前时间2分钟，则离线
export function isReqStatusValid (status) {
  return status == statusPass || status == statusPending
}

export async function getAllOnlineFriend (uid) {
  // todo db获取好友列表
  // todo redis获取在线好友
  console.log('Not supported')
}

export async function getFriendReqById (reqId) {
  if (!reqId) {
    return
  }
  return await prisma.friendRequest.findUnique({
    where: {
      id: reqId
    }
  })
}

export async function getPendingFriendReqList (uid) {
  const friendReqList = await prisma.friendRequest.findMany({
    where: {
      toUid: uid,
      status: statusPending
    }
  })
  return { code: 0, data: friendReqList }
}

export async function getFirendList (uid) {
  // throw Boom.unauthorized('getFirendList boom.')
  const friendIdList = await getFriendIdList(uid)
  return await prisma.user.findMany({
    select: {
      id: true,
      email: true,
      bio: true,
      username: true
    },
    where: {
      id: {
        in: friendIdList
      }
    }
  })
}

async function getFriendIdList (uid) {
  const friendList = await prisma.friend.findMany({
    where: {
      uid,
      status: statusPass
    }
  })
  return friendList?.map(f => f.friendId)
}

// todo 加锁
export async function makeFriends (reqId, uid, friendReq, status) {
  const friendId = friendReq?.fromUid
  if (!friendReq || friendReq.toUid != uid || friendId == uid) {
    return { err: 'Illegal param.' }
  }

  if (friendReq.status != statusPending) {
    return { err: 'Handled already.' }
  }

  // check if you were friends.
  const relationOfUser = await prisma.friend.findUnique({
    where: {
      uidAndFriendIdIdx: {
        uid,
        friendId
      }
    }
  })

  const relationOfFriend = await prisma.friend.findUnique({
    where: {
      uidAndFriendIdIdx: {
        uid: friendId,
        friendId: uid
      }
    }
  })

  // update friend relation
  let updateOrCreateFriendForUser
  let updateOrCreateFriendForFriend
  if (relationOfUser) {
    updateOrCreateFriendForUser = prisma.friend.update({
      where: {
        id: relationOfUser.id
      },
      data: {
        status
      }
    })
  } else {
    updateOrCreateFriendForUser = prisma.friend.create({
      data: {
        uid,
        friendId,
        status
      }
    })
  }
  if (relationOfFriend) {
    updateOrCreateFriendForFriend = prisma.friend.update({
      where: {
        id: relationOfFriend.id
      },
      data: {
        status
      }
    })
  } else {
    updateOrCreateFriendForFriend = prisma.friend.create({
      data: {
        uid: friendId,
        friendId: uid,
        status
      }
    })
  }
  // update friendRequest
  const updateFriendReq = prisma.friendRequest.update({
    where: {
      id: reqId
    },
    data: {
      status
    }
  })
  if (updateOrCreateFriendForUser && updateFriendReq && updateOrCreateFriendForFriend) {
    try {
      const txn = await prisma.$transaction([
        updateOrCreateFriendForFriend,
        updateOrCreateFriendForUser,
        updateFriendReq
      ])
      return { code: 0 }
    } catch (e) {
      console.log(e)
      return { err: e }
    }
  }
}

export async function newFriendRequest (fromUid, toUid, content) {
  if (!fromUid || !toUid) {
    return { err: 'Invalid params' }
  }
  try {
    // check remote user
    const remoteUser = await prisma.user.findUnique({
      where: {
        id: toUid
      }
    })
    if (!remoteUser) {
      return { err: 'No such remote user' }
    }

    // todo 加锁
    // find exist friend realtion.
    const friendRelation = await prisma.friend.findUnique({
      where: {
        uidAndFriendIdIdx: {
          uid: fromUid,
          friendId: toUid
        }
      }
    })
    if (friendRelation && friendRelation.status == statusPass) {
      return { err: 'Already friends.' }
    }
    // find exist friend request.
    const findReq = await prisma.friendRequest.findUnique({
      where: {
        fromUidAndtoUidIdx: {
          fromUid,
          toUid
        }
      }
    })
    // if there is an refused a req, update it.
    if (findReq) {
      if (findReq.status == statusPass) {
        return { err: 'You two are friends already.' }
      }
      if (findReq.status == statusPending) {
        return { err: 'Please wait for reply.' }
      }
      await prisma.friendRequest.updateMany({
        where: {
          fromUid,
          toUid,
          status: statusRefuse
        },
        data: {
          status: statusPending,
          content
        }
      })
    } else {
      // there is no exist req, create one.
      await prisma.friendRequest.create({
        data: {
          fromUid,
          toUid,
          status: statusPending,
          content
        }
      })
    }
    return { code: 0 }
  } catch (e) {
    console.error(e)
    return { err: e }
  }
}
