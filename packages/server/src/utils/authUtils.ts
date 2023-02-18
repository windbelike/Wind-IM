import { prisma } from './prismaHolder'
import jwt from 'jsonwebtoken'

export async function getUserFromCookieToken (token) {
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
