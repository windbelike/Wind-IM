import { getUserByEmail, getUserByUsernameAndTag } from '@/service/friend/friendService'
import { getAllPrivateMsg, createPrivateMsg, getPrivateMsgById } from '@/service/msg/msgService'
import * as Boom from '@hapi/boom'

// get private msg list
export async function privateMsgListGet (req, res, next) {
  try {
    const user = req.windImUser
    const wrappedData = wrapPrivateMsg(user.id, await getAllPrivateMsg(user.id))
    res.json({ data: wrappedData })
  } catch (e) {
    next(e)
  }
}

// create private msg
export async function privateMsgPost (req, res, next) {
  try {
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
  } catch (e) {
    next(e)
  }
}

// get private msg by Id
export async function privateMsgGet (req, res, next) {
  try {
    const user = req.windImUser
    const msgId = parseInt(req.query?.id)
    const msgInfo = await getPrivateMsgById(msgId)
    if (!msgInfo) {
      throw Boom.badRequest('No such msg.')
    }
    // just ignore this stupid warning
    if (msgInfo.fromUid == user.id) {
      msgInfo.msgTitle = msgInfo.toUidRel.username + '#' + msgInfo.toUidRel.tag
    } else {
      msgInfo.msgTitle = msgInfo.fromUidRel.username + '#' + msgInfo.fromUidRel.tag
    }
    res.json({ data: msgInfo })
  } catch (e) {
    next(e)
  }
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
