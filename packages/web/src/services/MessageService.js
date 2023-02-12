import { prisma } from '@/utils/server-utils'

export async function createPrivateMsg (fromUid, toUid) {
  if (!fromUid || !toUid || fromUid == toUid) {
    return { error: 'Invalid params' }
  }
  // todo 加锁
  const privateMsgExisted = await getExistedPrivateMsg(fromUid, toUid)
  if (privateMsgExisted && privateMsgExisted.length != 0) {
    return privateMsgExisted[0]
  }

  return await prisma.privateMsg.create({
    data: {
      fromUidRel: {
        connect: { id: fromUid }
      },
      toUidRel: {
        connect: { id: toUid }
      }
    }
  })
}

export async function getExistedPrivateMsg (fromUid, toUid) {
  return await prisma.privateMsg.findMany({
    where: {
      OR: [
        {
          fromUid,
          toUid
        },
        {
          fromUid: toUid,
          toUid: fromUid
        }
      ]
    },
    include: {
      fromUidRel: { select: { email: true } },
      toUidRel: { select: { email: true } }
    }
  })
}

export async function getAllPrivateMsg (uid) {
  return await prisma.privateMsg.findMany({
    where: {
      OR: [
        {
          fromUid: uid
        },
        {
          toUid: uid
        }
      ]
    },
    include: {
      fromUidRel: { select: { email: true } },
      toUidRel: { select: { email: true } }
    }
  })
}
