
import { prisma, apiHandler, getUserFromReq, loginValidator } from 'src/utils/server-utils'

// 好友请求状态，0: 通过   1: 拒绝   2: Pending
export const statusPass = 0
export const statusRefuse = 1
export const statusPending = 2

export function isReqStatusValid (status) {
  return status && (status == 0 || status == 2)
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
      to_uid: uid,
      status: statusPending
    }
  })
  return { code: 0, data: friendReqList }
}

export async function getFirendList (uid) {
  return await prisma.friend.findMany({
    where: {
      uid,
      status: statusPass
    }
  })
}

// todo 加锁
export async function makeFriends (reqId, uid, friendId, status) {
// check if you were friends.
  const relationOfUser = await prisma.friend.findUnique({
    where: {
      user_and_friend_id: {
        uid,
        friend_id: friendId
      }
    }
  })

  const relationOfFriend = await prisma.friend.findUnique({
    where: {
      user_and_friend_id: {
        uid: friendId,
        friend_id: uid
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
        friend_id: friendId,
        status
      }
    })
  }
  if (relationOfFriend) {
    updateOrCreateFriendForFriend = prisma.friend.update({
      where: {
        id: relationOfUser.id
      },
      data: {
        status
      }
    })
  } else {
    updateOrCreateFriendForFriend = prisma.friend.create({
      data: {
        uid,
        friend_id: friendId,
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
      return { err: e }
    }
  }
}
