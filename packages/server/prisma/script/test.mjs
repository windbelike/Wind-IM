import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

// https://www.prisma.io/docs/concepts/components/prisma-client/crud
async function main () {
  const user = await prisma.user.findMany({
    // where: {
    //   email: 'sawyer'
    // }
  })

  // const resc = await createFriend(43, 42)
  // const res = await prisma.friend.findMany({
  //   where: { uid: 43 },
  //   include: {
  //     userRel: {
  //       select: {
  //         email: true
  //       }
  //     },
  //     friendRel: {
  //       select: {
  //         email: true,
  //         pwd: true
  //       }
  //     }
  //   }
  // })
  const res = await checkIsFriend(43, 42)
  console.log(res)
  // console.log(user)
}

async function checkIsFriend (uid, friendId) {
  return await prisma.friend.findUnique({
    where: {
      uid_friendId: {
        uid,
        friendId
      }
    }
  })
}

async function createFriend (uid, friendId) {
  await prisma.friend.create({
    data: {
      userRel: {
        connect: { id: uid }
      },
      friendRel: {
        connect: { id: friendId }
      }
    }
  })

  await prisma.friend.create({
    data: {
      userRel: {
        connect: { id: friendId }
      },
      friendRel: {
        connect: { id: uid }
      }
    }
  })
}

async function deleteTestUsers () {
  for (let i = 0; i < 20; i++) {
    await prisma.user.deleteMany({
      where: {
        email: i + ''
      }
    })
  }
}

async function createTestUsers () {
  for (let i = 0; i < 20; i++) {
    await createUser(i + '', '1')
  }
}

async function createUser (email, pwd) {
  const created = await prisma.user.create({
    data: {
      email,
      pwd: bcrypt.hashSync(pwd, 10)
    }
  })
}

main()
