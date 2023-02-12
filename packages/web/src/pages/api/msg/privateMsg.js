import { apiHandler, loginValidator } from 'src/utils/server-utils'
import { getAllPrivateMsg, createPrivateMsg } from '@/services/MessageService'
import { getUserByEmail } from '@/services/FriendService'
import * as Boom from '@hapi/boom'

export default apiHandler()
  .get(loginValidator, async (req, res) => {
    const user = req.windImUser
    const wrappedData = wrapPrivateMsg(user.id, await getAllPrivateMsg(user.id))
    res.json({ data: wrappedData })
  })
  .post(loginValidator, async (req, res) => {
    const user = req.windImUser
    const fromUid = user.id
    const toEmail = req.body.email
    const remoteUser = await getUserByEmail(toEmail)
    if (!remoteUser?.id) {
      throw Boom.badRequest('Invalid params.')
    }
    const toUid = remoteUser.id

    res.json({ data: await createPrivateMsg(fromUid, toUid) })
  })

function wrapPrivateMsg (uid, allPrivateMsg) {
  return allPrivateMsg.map(m => {
    if (m.fromUid == uid) {
      m.msgTitle = m.toUidRel.email
    } else {
      m.msgTitle = m.fromUidRel.email
    }
    return m
  })
}
