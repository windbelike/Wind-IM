import { prisma } from '@/utils/prismaHolder'
import jwt from 'jsonwebtoken'
import * as Boom from '@hapi/boom'

export type User = {
  id: Number,
  email: String,
  bio: String,
  username: String
}

// General response

export type Resp = {
  code: Number,
  data: object,
  error: object
}

export async function getUserFromCookieToken (token): Promise<User> {
  if (!token) {
    return null
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    // find user in database
    const user = await prisma.user.findUnique({
      select: {
        id: true,
        email: true,
        bio: true,
        username: true
      },
      where: {
        email: payload.email
      }
    })

    return user
  } catch (e) {
    return null
  }
}

export const loginValidator = async (req, res, next) => {
  // to validate if current use have already logined.
  const user = await getUserFromReq(req)
  if (!user) {
    throw Boom.forbidden('Please login in first')
  }
  req.windImUser = user
  next()
}
// hanlde authorization
export const getUserFromReq = async (req) => {
  // get JWT `token` on cookies
  const token = req.cookies.token
  return await getUserFromCookieToken(token)
}

