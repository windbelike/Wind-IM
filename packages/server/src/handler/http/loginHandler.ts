import Boom from '@hapi/boom'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'
import { prisma } from '@/utils/prismaHolder'

async function validate (email, pwd) {
  if (!email || !pwd) {
    console.log('login#validate, invalid params')
    return
  }
  // validate the mail and password
  const user = await prisma.user.findUnique({
    where: {
      email
    }
  })
  if (!user) {
    throw Boom.unauthorized('user not found')
  }
  if (bcrypt.compareSync(pwd, user.pwd)) {
    return user
  } else {
    throw Boom.unauthorized('email or password not correct')
  }
}

export async function loginPost (req, res) {
  console.log('loginPost...')
  // todo body undefined
  const body = req.body
  const user = await validate(body.email, body.pwd)
  const expireDays = 7
  const token = jwt.sign(
    { email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: `${expireDays} days` }
  )

  // set a cookie named `token`
  res.setHeader('Set-Cookie', cookie.serialize('token', token, {
    httpOnly: true,
    path: '/',
    maxAge: 60 * 60 * 24 * expireDays
  }))

  res.json({ ok: true })
}
