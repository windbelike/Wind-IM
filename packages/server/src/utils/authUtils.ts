import { prisma } from '@/utils/prismaHolder'
import jwt from 'jsonwebtoken'

type User = {
  id: Number,
  email: String,
  bio: String,
  username: String
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
