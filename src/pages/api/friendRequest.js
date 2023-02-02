
import { prisma, apiHandler, getUserFromReq, loginValidator } from 'src/utils/server-utils'

export default apiHandler()
  .get(loginValidator, async (req, res) => {
    const body = req.body
    const opType = body.type
    if (opType === 0) {
      craeteNewFriendReq(req)
    } else if (opType === 1) {
      handleFriendReq(req)
    }
    res.json({ msg: 'ok' })
  })
  .post(loginValidator, async (req, res) => {
  // 两种操作类型：
  // 1. 好友申请
  // 2. 好友申请操作，通过 or 拒绝
    const body = req.body
    const opType = body.type
    if (opType === 0) {
      craeteNewFriendReq(req)
    } else if (opType === 1) {
      handleFriendReq(req)
    }
  })

async function craeteNewFriendReq (req) {
  const user = await getUserFromReq(req)

  // prisma.friendRequest.create({
  //   data: {
  //     uid: 1,
  //     friend_id: 3
  //   }
  // })
}

function handleFriendReq (body) {

}
