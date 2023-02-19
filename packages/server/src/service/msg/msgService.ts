import { off } from 'process'
import { prisma } from '../../utils/prismaHolder'

const privateMsgType = 0
const channelMsgType = 1

export async function getDestUserOfPrivateMsg (privateMsgId, uid) {
  try {
    const privateMsg = await prisma.privateMsg.findUnique({
      where: {
        id: parseInt(privateMsgId)
      }
    })
    if (!privateMsg) {
      return null
    }
    // choose peer id
    if (privateMsg.toUid == uid) {
      return privateMsg.fromUid
    } else if (privateMsg.fromUid == uid) {
      return privateMsg.toUid
    } else {
      console.error('Invalid privateMsgId and uid')
      return null
    }
  } catch (e) {
    console.log('#getDestUserOfPrivateMsg error')
    console.error(e)
  }
}

export async function persistPrivateMsg (privateMsgId, fromUid, toUid, content) {
  try {
    return await prisma.message.create({
      data: {
        fromUidRel: { connect: { id: fromUid } },
        toUidRel: { connect: { id: toUid } },
        privateMsgId,
        content,
        msgType: privateMsgType,
        pushed: true,
        read: true
      }
    })
  } catch (e) {
    console.error(e)
  }
}

export async function fetchAllMissedPrivateMsg (privateMsgId, offset) {
  try {
    return await prisma.message.findMany({
      select: {
        id: true,
        fromUid: true,
        toUid: true,
        content: true
      },
      where: {
        id: {
          gt: offset
        },
        privateMsgId
      }
    })
  } catch (e) {
    console.log(e)
  }
}
