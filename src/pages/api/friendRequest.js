
import { prisma, apiHandler, getUserFromReq, loginValidator } from 'src/utils/server-utils'

// 好友请求状态，0: 通过   1: 拒绝   2: Pending
const statusPass = 0
const statusRefuse = 1
const statusPending = 2

export default apiHandler()
  .post(loginValidator, async (req, res) => {
  // 两种操作类型：
  // 1. 好友申请
  // 2. 好友申请操作，通过 or 拒绝
    const opType = req.body?.opType
    let resultJson
    if (opType == 0) {
      resultJson = await craeteNewFriendReq(req, res)
    } else if (opType == 1) {
      resultJson = await handleFriendReq(req, res)
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
async function craeteNewFriendReq (req, res) {
  const fromUid = req.windImUser?.id
  const toUid = req.body?.toUid
  if (!fromUid || !toUid || toUid == fromUid) {
    console.log('#craeteNewFriendReq invalid param.')
    return { err: 'Invalide param' }
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
    const findReq = await prisma.friendRequest.findFirst({
      where: {
        from_uid: fromUid,
        to_uid: toUid
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
          status: statusPending
        }
      })
    } else {
      // there is no exist req, create one.
      await prisma.friendRequest.create({
        data: {
          from_uid: fromUid,
          to_uid: toUid,
          status: statusPending
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
 * @param {Int} body.opType = 1
 * @param {Int} body.fromUid
 * @param {Int} body.status
 *
 * @returns {code, data, err}
 */
function handleFriendReq (req, res) {
  return { err: 'Not supported.' }
}
