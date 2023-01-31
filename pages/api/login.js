import Boom from '@hapi/boom'
import { apiHandler, prisma } from '../../src/utils/server-utils'
import bcrypt from 'bcrypt'
async function validate (email, pwd) {
  // validate the username and password
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
  .get((req, res) => {
    res.json({ msg: 'ok' })
  })
  .post(async (req, res) => {
    const body = req.body
    const user = await validate(body.email, body.pwd)
    res.json({ user })
  })
