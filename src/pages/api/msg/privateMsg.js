import { apiHandler, loginValidator } from 'src/utils/server-utils'
import { getAllPrivateMsg, createPrivateMsg } from '@/services/MessageService'

export default apiHandler()
  .get(loginValidator, async (req, res) => {
    const user = req.windImUser
    res.json({ data: await getAllPrivateMsg(user.id) })
  })
  .post(loginValidator, async (req, res) => {
    const user = req.windImUser
    const toUid = req.body.toUid
    // 查询是否有存在的private msg，不存在则创建
    res.json({ data: await getAllPrivateMsg(user.id) })
  })
