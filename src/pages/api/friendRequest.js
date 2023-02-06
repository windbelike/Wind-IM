
import { prisma, apiHandler, getUserFromReq, loginValidator } from 'src/utils/server-utils'

// 好友请求状态，0: 通过   1: 拒绝   2: Pending
const statusPass = 0
const statusRefuse = 1
const statusPending = 2

function isStatusValid (status) {
  return status && (status == 1 || status == 2)
}

export default apiHandler()
  .post(loginValidator, async (req, res) => {
  // 两种操作类型：
  // 1. 好友申请
  // 2. 好友申请操作，通过 or 拒绝
    const opType = req.body?.opType
    let resultJson
    if (opType == 0) {
      resultJson = await craeteNewFriendReq(req)
    } else if (opType == 1) {
      resultJson = await handleFriendReq(req)
    } else {
      resultJson = { msg: 'invalid opType' }
    }
    res.json(resultJson)
  })

/**
 * @param {Object} req.body
 * @param {Int} body.opType = 0
 * @param {Int} body.toUid
 * @returns {code, data, err}
*/
async function craeteNewFriendReq (req) {
  const fromUid = req.windImUser?.id
  const toUid = req.body?.toUid
  const content = req.body?.content
  if (!fromUid || !toUid || toUid == fromUid) {
    return { err: 'Invalid param' }
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
    // find exsit friend request.
    const findReq = await prisma.friendRequest.findUnique({
      where: {
        from_and_to_id: {
          from_uid: fromUid,
          to_uid: toUid
        }
      }
    })
    // if there is an exist a req, update it.
    if (findReq) {
      if (findReq.status == statusPass) {
        return { err: 'You two are friends already.' }
      }
      if (findReq.status == statusPending) {
        return { err: 'Please wait for reply.' }
      }
      await prisma.friendRequest.update({
        where: {
          from_uid: fromUid,
          to_uid: toUid,
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
          from_uid: fromUid,
          to_uid: toUid,
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

/**
 * @param {Object} req.body
 * @param {Int} body.reqId
 * @param {Int} body.opType = 1
 * @param {Int} body.status
 *
 * @returns {code, data, err}
 */
async function handleFriendReq (req) {
  const user = req.windImUser
  const reqId = req.body?.reqId
  const status = req.body?.status
  if (!reqId || !isStatusValid(status) || !user) {
    return { err: 'Invalid param' }
  }

  const friendReq = await prisma.friendRequest.findUnique({
    where: {
      id: reqId
    }
  })

  if (!friendReq || friendReq.to_uid != user.id || friendReq.from_uid == user.id) {
    return { err: 'Illegal param.' }
  }

  if (friendReq.status != statusPending) {
    return { err: 'Handled already.' }
  }

  // check if you were friends.
  const friend = await prisma.friend.findUnique({
    where: {
      user_and_friend_id: {
        uid: friendReq.from_uid,
        friend_id: user.id
      }
    }
  })

  let updateOrCreateFriend
  if (friend) {
    updateOrCreateFriend = prisma.friend.update({
      where: {
        id: friend.id
      },
      data: {
        status
      }
    })
  } else {
    updateOrCreateFriend = prisma.friend.create({
      data: {
        uid: user.id,
        friend_id: friendReq.from_uid,
        status
      }
    })
  }
  // update friendRequest relation
  const updateFriendReq = prisma.friendRequest.update({
    where: {
      id: reqId
    },
    data: {
      status
    }
  })
  if (updateOrCreateFriend && updateFriendReq) {
    try {
      const txn = await prisma.$transaction([updateOrCreateFriend, updateFriendReq])
      return { code: 0 }
    } catch (e) {
      return { err: e }
    }
  }
}
