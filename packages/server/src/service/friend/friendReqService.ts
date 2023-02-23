import { statusPass, statusPending, statusRefuse } from '@/utils/friend-enums'
import { prisma } from '@/utils/prismaHolder'
import * as Boom from '@hapi/boom'
import { checkIsFriends, makeFriends } from './friendService'

export async function getPendingFriendReqList (uid) {
  const friendReqList = await prisma.friendRequest.findMany({
    where: {
      toUid: uid,
      status: statusPending
    },
    include: {
      fromUidRel: {
        select: {
          email: true
        }
      }
    }
  })
  return { code: 0, data: friendReqList }
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

export async function passFriendReq (reqId, uid) {
  const friendReq = await getFriendReqById(reqId)
  if (!friendReq) {
    return Boom.badRequest('Invalid reqId.')
  }
  const friendId = friendReq.fromUid
  if (friendReq.status != statusPending) {
    return Boom.badRequest('Handled already.')
  }
  if (friendReq.toUid != uid) {
    return Boom.badRequest('Not your request.')
  }
  return await makeFriends(reqId, uid, friendId)
}

export async function refuseFriendReq (reqId) {
  if (!reqId) {
    return
  }
  // 不想用事务，直接update where保证原子性
  // 因为prisma的update只能在uniq idx情况下使用，所以updateMany
  const res = await prisma.friendRequest.updateMany({
    where: {
      id: reqId,
      status: statusPending
    },
    data: {
      status: statusRefuse
    }
  })
  return { code: 0 }
}

export async function newFriendRequest (fromUid, toUid, content) {
  if (!fromUid || !toUid) {
    return { error: 'Invalid params' }
  }
  // check remote user
  const friendUser = await prisma.user.findUnique({
    where: {
      id: toUid
    }
  })
  if (!friendUser) {
    return { error: 'No such remote user' }
  }

  // todo 加锁
  // find existed friend realtion.
  if (await checkIsFriends(fromUid, toUid)) {
    console.log('checkIsFriends checkIsFriends')
    throw Boom.badRequest('Already friends....')
  }
  // 处理对方的请求
  const findReqFromRemote = await prisma.friendRequest.findUnique({
    where: {
      fromUidAndtoUidIdx: {
        fromUid: toUid,
        toUid: fromUid
      }
    }
  })
  if (findReqFromRemote?.status == statusPending) {
    throw Boom.badRequest('Got a pending request from remote.')
  }
  // find existed friend request.
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
      return { error: 'You two are friends already.' }
    }
    if (findReq.status == statusPending) {
      return { error: 'Please wait for reply.' }
    }
    await prisma.friendRequest.update({
      where: {
        fromUidAndtoUidIdx: {
          fromUid,
          toUid
        }
      },
      data: {
        status: statusPending,
        content
      }
    })
  } else {
    // there is no existed req, create one.
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
}
