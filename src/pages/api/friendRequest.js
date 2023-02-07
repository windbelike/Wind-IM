
import { apiHandler, loginValidator } from 'src/utils/server-utils'
import { isReqStatusValid, makeFriends, getFriendReqById, getPendingFriendReqList, newFriendRequest } from 'src/services/friend-service'

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
    return { err: 'Invalid param' }
  }

  const friendReq = await getFriendReqById(reqId)

  return await makeFriends(reqId, user.id, friendReq, status)
}

async function getFriendReq (req) {
  const user = req.windImUser
  if (!user) {
    return { err: 'Please login first.' }
  }

  return await getPendingFriendReqList(user.id)
}
