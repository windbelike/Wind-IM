import { prisma } from '@/utils/prismaHolder'
import bcrypt from 'bcrypt'
import * as Boom from '@hapi/boom'
import { redis } from 'utils/redisHolder'

export async function queryUserById (id:number) {
  return await prisma.user.findUnique({
    where: {
      id
    }
  })
}

export async function signup (email:string, username: string, pwd: string) {
  checkSignupParam(email, username, pwd)
  const tag = await generateUserTag(username)
  if (!tag) {
    throw Boom.badRequest('Failed to generate a tag for username:' + username)
  }
  const created = await prisma.user.create({
    data: {
      username,
      tag,
      email,
      pwd: bcrypt.hashSync(pwd, 10)
    },
    select: {
      username: true,
      tag: true
    }
  })

  return created
}

function checkSignupParam (email: string, username: string, pwd: string) {
  if (!email ||
    !username ||
    !pwd ||
    !email.trim() ||
    !username.trim() ||
    !pwd.trim()) {
    throw Boom.badRequest('Invalid signup params.')
  }
  if (username.length > 12 || pwd.length > 16 || email.length > 50) {
    throw Boom.badRequest('Invalid legnth of signup params.')
  }
  // const emailReg = /'^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$'/
  // const emailIsValid = emailReg.test(email)
  // if (!emailIsValid) {
  //   throw Boom.badRequest('Invalid email' + email)
  // }
}

// tag format: 0000-9999
async function generateUserTag (username: string) {
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

// become online status（global）
export async function onlineHeartbeat (id) {
  const userOnlineKey = buildUserOnlineKey(id)
  await redis.set(userOnlineKey, 'true', 'EX', 60) // after 60s, become offline automatically
}

function buildUserOnlineKey (id) {
  return `user-${id}-online`
}

// become online status in a channel
export async function becomeOnlineInChannel (uid, channelId) {
  const channelOnlineUsersKey = buildChannelOnlineUserskey(channelId)
  redis.sadd(channelOnlineUsersKey, uid)
}

// become offline status in a channel
export async function becomeOfflineInChannel (uid, channelId) {
  const channelOnlineUsersKey = buildChannelOnlineUserskey(channelId)
  redis.srem(channelOnlineUsersKey, uid)
}

export function buildChannelOnlineUserskey (channelId: number) {
  return `channel-${channelId}-onlineUsers`
}

// get channel online info
export async function channelOnlineInfo (channelId) {
  const channelOnlineUsersKey = buildChannelOnlineUserskey(channelId)
  const elementCount = await redis.scard(channelOnlineUsersKey) // get element count of a set
  const onlineUsers = await redis.smembers(channelOnlineUsersKey)
  return {
    elementCount,
    onlineUsers
  }
}
