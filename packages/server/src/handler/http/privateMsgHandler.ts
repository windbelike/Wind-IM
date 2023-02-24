import { getUserByEmail, getUserByUsernameAndTag } from '@/service/friend/friendService'
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
  const toUsernameAndTag = req.body.usernameAndTag
  const username = toUsernameAndTag.split('#')[0]
  const tag = toUsernameAndTag.split('#')[1]
  const remoteUser = await getUserByUsernameAndTag(username, tag)
  if (!remoteUser?.id) {
    throw Boom.badRequest('No such user.')
  }
  const toUid = remoteUser.id

  res.json({ data: await createPrivateMsg(fromUid, toUid) })
}

function wrapPrivateMsg (uid, allPrivateMsg) {
  return allPrivateMsg.map(m => {
    if (m.fromUid == uid) {
      m.msgTitle = m.toUidRel.username + '#' + m.toUidRel.tag
    } else {
      m.msgTitle = m.fromUidRel.username + '#' + m.fromUidRel.tag
    }
    return m
  })
}
