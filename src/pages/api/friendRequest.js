
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
    console.log(req.body)
    if (opType == 0) {
      craeteNewFriendReq(req, res)
    } else if (opType == 1) {
      handleFriendReq(req, res)
    } else {
      res.json({
        msg: 'invalid opType'
      })
    }
  })

/**
 * @param {Object} req.body
 * @param {Int} body.opType = 0
 * @param {Int} body.toUid
*/
async function craeteNewFriendReq (req, res) {
  const fromUid = req.windImUser?.id
  const toUid = req.body?.toUid
  if (!fromUid || !toUid) {
    console.log('#craeteNewFriendReq invalid param.')
    return
  }

  try {
    // todo 加锁
    const findReq = await prisma.friendRequest.findFirst({
      where: {
        from_uid: fromUid,
        to_uid: toUid
      }
    })
    // if there is an exist a req, update it.
    if (findReq) {
      console.log('duplicated friend request.')
      await prisma.friendRequest.update({
        where: {
          from_uid: fromUid,
          to_uid: toUid
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
          to_dui: toUid,
          status: statusPending
        }
      })
    }
    res.json({
      msg: 'ok'
    })
  } catch (e) {
    console.error(e)
    res.json({
      msg: 'done',
      error: e
    })
  }
}

/**
 *
 * @param {Object} req.body
 * @param {Int} body.opType = 1
 * @param {Int} body.fromUid
 * @param {Int} body.status
 */
function handleFriendReq (req, res) {

}
