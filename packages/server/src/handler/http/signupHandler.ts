import { signup } from '@/service/user/userService'

export async function signupPost (req, res, next) {
  try {
    const body = req.body

    const created = await signup(body.email, body.username, body.pwd)
    if (created) {
      res.json({
        code: 0,
        message: 'signup success'
      })
    } else {
      res.json({
        code: 1,
        message: 'signup error'
      })
    }
  } catch (e) {
    next(e)
  }
}
