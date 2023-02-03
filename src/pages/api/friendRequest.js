
import { prisma, apiHandler, getUserFromReq, loginValidator } from 'src/utils/server-utils'

// 请求状态，0: 通过   1: 拒绝   2: Pending
const statusPass = 0
const statusRefuse = 1
const statusPending = 2

export default apiHandler()
  .get(loginValidator, async (req, res) => {
  // 两种操作类型：
  // 1. 好友申请
  // 2. 好友申请操作，通过 or 拒绝
    const opType = req.body?.type
    craeteNewFriendReq(req)
    res.json({ msg: JSON.stringify(req.body) })
  })
  .post(loginValidator, async (req, res) => {
  // 两种操作类型：
  // 1. 好友申请
  // 2. 好友申请操作，通过 or 拒绝
    const opType = req.body?.type
    if (opType === 0) {
      craeteNewFriendReq(req)
    } else if (opType === 1) {
      handleFriendReq(req)
    }
  })

async function craeteNewFriendReq (req) {
  const user = req.windImUser
  console.log(JSON.stringify(user))
  const body = req.body
  const fromUid = body.fromUid
  const toUid = body.toUid
  if (!body || !fromUid || !toUid) {
    return
  }

  // todo 加锁
  const findReq = await prisma.friendRequest.findUnique({
    where: {
      from_uid: fromUid,
      to_dui: toUid
    }
  })
  if (findReq) {
    console.log('duplicated friend request.')
    prisma.friendRequest.update({
      where: {
        from_uid: fromUid,
        to_dui: toUid
      },
      data: {
        status: statusPending
      }
    })
    return
  }
  prisma.friendRequest.create({
    data: {
      from_uid: fromUid,
      to_dui: toUid,
      status: statusPending
    }
  })
}

function handleFriendReq (body) {

}
