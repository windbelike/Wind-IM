import { getUserByEmail, getUserByUsernameAndTag, isReqStatusValid } from '@/service/friend/friendService'
import { getPendingFriendReqList, newFriendRequest, passFriendReq, refuseFriendReq } from '@/service/friend/friendReqService'
import { statusPass } from '@/utils/friend-enums'
import * as Boom from '@hapi/boom'

export async function friendReqPost (req, res, next) {
  try {
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
  } catch (e) {
    next(e)
  }
}

export async function friendReqGet (req, res, next) {
  try {
    // 获取pending的好友请求
    const user = req.windImUser
    if (!user) {
      throw Boom.badRequest('Please login first.')
    }
    res.json(await getPendingFriendReqList(user.id))
  } catch (e) {
    next(e)
  }
}

/**
 * @param {Object} req.body
 * @param {Int} body.opType = 0
 * @param {Int} body.toUid
 * @returns {code, data, err}
*/
async function createNewFriendReq (req) {
  const fromUid = req.windImUser?.id
  const usernameAndTag = req.body?.usernameAndTag
  if (!usernameAndTag || !usernameAndTag.trim()) {
    throw Boom.badRequest('User not found.')
  }
  const username = usernameAndTag.split('#')[0]
  const tag = usernameAndTag.split('#')[1]
  if (!username || !tag) {
    throw Boom.badRequest('User not found.')
  }
  const toUser = await getUserByUsernameAndTag(username, tag) // todo use cache instead of requesting db directly.
  if (!toUser) {
    throw Boom.badRequest('User not found.')
  }
  const toUid = toUser.id
  const content = req.body?.content
  if (!fromUid || !toUid || toUid == fromUid) {
    throw Boom.badRequest('Invalid params error')
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
