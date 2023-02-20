import { prisma } from '@/utils/prismaHolder'
import bcrypt from 'bcrypt'

export async function signupPost (req, res, next) {
  try {
    const body = req.body
    console.log(body)
    const created = await prisma.user.create({
      data: {
        email: body.email,
        pwd: bcrypt.hashSync(body.pwd, 10)
      }
    })
    res.json({
      code: 200,
      message: 'success'
    })
  } catch (e) {
    next(e)
  }
}
