
import { apiHandler, loginValidator } from 'src/utils/server-utils'
import { isReqStatusValid, makeFriends, getFriendReqById, getPendingFriendReqList, newFriendRequest, getUserByEmail, refuseFriendReq, passFriendReq } from '@/services/FriendService'
import * as Boom from '@hapi/boom'
import { statusPass, statusPending } from '@/utils/friend-enums'

export default apiHandler()
  .get(loginValidator, async (req, res) => {
    // 获取pending的好友请求
    const user = req.windImUser
    if (!user) {
      throw Boom.badRequest('Please login first.')
    }
    res.json(await getFriendReq(user.id))
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
      throw Boom.badRequest('Invalid opType')
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
  const email = req.body?.email
  const toUser = await getUserByEmail(email) // todo use cache instead of requesting db directly.
  if (!toUser) {
    throw Boom.badRequest('User not found.')
  }
  const toUid = toUser.id
  const content = req.body?.content
  if (!fromUid || !toUid || toUid == fromUid) {
    throw Boom.badRequest('Invalid param error')
  }
  return await newFriendRequest(fromUid, toUid, content)
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
    return Boom.badRequest('Invalid params.')
  }

  if (status == statusPass) {
    // pass new friend request
    return await passFriendReq(reqId, user.id)
  } else {
    // refuse new friend request
    return await refuseFriendReq(reqId)
  }
}

async function getFriendReq (uid) {
  return await getPendingFriendReqList(uid)
}