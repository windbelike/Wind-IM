
import { prisma, apiHandler, getUserFromReq, loginValidator } from 'src/utils/server-utils'
import { statusPass, statusPending, statusRefuse, isReqStatusValid, makeFriends, getFriendReqById, getPendingFriendReqList } from 'src/services/user-service'

export default apiHandler()
  .get(loginValidator, async (req, res) => {
    res.json(await getFriendReq(req))
  })
  .post(loginValidator, async (req, res) => {
  // 两种操作类型：
  // 1. 好友申请
  // 2. 好友申请操作，通过 or 拒绝
    const opType = req.body?.opType
    let resultJson
    if (opType == 0) {
      resultJson = await createNewFriendReq(req)
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
async function createNewFriendReq (req) {
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
    // find exist friend realtion.
    const friendRelation = await prisma.friend.findUnique({
      where: {
        user_and_friend_id: {
          uid: fromUid,
          friend_id: toUid
        }
      }
    })
    if (friendRelation && friendRelation.status == statusPass) {
      return { err: 'Already friends.' }
    }
    // find exist friend request.
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
      await prisma.friendRequest.updateMany({
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
  if (!reqId || !isReqStatusValid(status) || !user) {
    return { err: 'Invalid param' }
  }

  const friendReq = await getFriendReqById(reqId)

  const friendId = friendReq?.from_uid
  if (!friendReq || friendReq.to_uid != user.id || friendId == user.id) {
    return { err: 'Illegal param.' }
  }

  if (friendReq.status != statusPending) {
    return { err: 'Handled already.' }
  }

  return await makeFriends(reqId, user.id, friendId, status)
}

async function getFriendReq (req) {
  const user = req.windImUser
  if (!user) {
    return { err: 'Please login first.' }
  }

  return await getPendingFriendReqList(user.id)
}
