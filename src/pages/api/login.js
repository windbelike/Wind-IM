import Boom from '@hapi/boom'
import { apiHandler, prisma } from '../../utils/server-utils'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import cookie from 'cookie'

async function validate (email, pwd) {
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

export default apiHandler()
  .post(async (req, res) => {
    const body = req.body
    const user = await validate(body.email, body.pwd)
    const token = jwt.sign(
      { email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '3 days' }
    )

    // set a cookie named `token`
    res.setHeader('Set-Cookie', cookie.serialize('token', token, {
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24 * 3
    }))

    res.json({ ok: true })
  })
