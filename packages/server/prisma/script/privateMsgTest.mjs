import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()
async function main () {
  // console.log(await createPrivateMsg(43, 41))
  // console.log(await getAllPrivateMsg(41))
  console.log(await getExistedPrivateMsg(41, 43))
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
export async function createPrivateMsg (fromUid, toUid) {
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

main()
