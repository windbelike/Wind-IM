import { getUserByEmail } from '@/service/friend/friendService'
import { getAllPrivateMsg, createPrivateMsg } from '@/service/msg/msgService'
import * as Boom from '@hapi/boom'

export async function privateMsgGet (req, res) {
  const user = req.windImUser
  const wrappedData = wrapPrivateMsg(user.id, await getAllPrivateMsg(user.id))
  res.json({ data: wrappedData })
}

export async function privateMsgPost (req, res) {
  const user = req.windImUser
  const fromUid = user.id
  const toEmail = req.body.email
  const remoteUser = await getUserByEmail(toEmail)
  if (!remoteUser?.id) {
    throw Boom.badRequest('Invalid params.')
  }
  const toUid = remoteUser.id

  res.json({ data: await createPrivateMsg(fromUid, toUid) })
}

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
