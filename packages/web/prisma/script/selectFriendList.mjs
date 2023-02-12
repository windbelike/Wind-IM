import { PrismaClient, Prisma } from '@prisma/client'

const prisma = new PrismaClient()

// todo unit test

// https://www.prisma.io/docs/concepts/components/prisma-client/crud
async function selectAll () {
  const friends = await prisma.friend.findMany({
    where: {
      uid: 3
    }
  })
  console.log(JSON.stringify(friends))
}

async function createFriend () {
  // 无await的时候不执行实际操作，太神奇了
  const friendsForMe = prisma.friend.create({
    data: {
      uid: 1,
      friend_id: 3
    }
  })
  const friendsForU = prisma.friend.create({
    data: {
      uid: 3,
      friend_id: 1
    }
  })
  try {
    const res = await prisma.$transaction([friendsForMe, friendsForU])
    console.log(res)
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      // The .code property can be accessed in a type-safe manner
      if (e.code === 'P2002') {
        console.log(
          'There is a unique constraint violation, a new user cannot be created with this email'
        )
      }
    }
    // throw e
  }
}

async function deleteFriendDup () {
  const res = await prisma.friend.deleteMany({
    where: {
      OR: [
        {
          uid: 3

        },
        {
          uid: 1
        }
      ]
    }
  })
  console.log(res)
}

createFriend()
