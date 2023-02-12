import { prisma } from '@/utils/server-utils'

export async function createPrivateMsg (fromUid, toUid) {
  if (!fromUid || !toUid || fromUid == toUid) {
    return { error: 'Invalid params' }
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
    }
  })
}
