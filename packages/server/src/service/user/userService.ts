import { prisma } from '@/utils/prismaHolder'
import bcrypt from 'bcrypt'

export async function signup (username: string, pwd: string) {
  if (!username || !pwd) {
    console.error('Invalid signup params.')
    return
  }
  if (username.length > 12) {
    console.error('Invalid legnth of signup username:' + username)
    return
  }
  const tag = await generateTag(username)
  if (!tag) {
    console.error('Failed to generate a tag for username:' + username)
    return
  }
  const created = await prisma.user.create({
    data: {
      username,
      tag,
      pwd: bcrypt.hashSync(pwd, 10),
      email: ''
    },
    select: {
      username: true,
      tag: true
    }
  })

  return created
}

async function generateTag (username: string) {
  if (!username) {
    return
  }
  let retryTimes = 5
  while (retryTimes > 0) {
    const tag = Math.floor(Math.random() * 10000).toString().padStart(4, '0')
    const userExisted = await prisma.user.findUnique({
      where: {
        usernameAndTagIdx: {
          username,
          tag
        }
      }
    })
    if (!userExisted) {
      return tag
    }
    retryTimes--
  }
}
