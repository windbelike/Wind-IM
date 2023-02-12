import cookie from 'cookie'
import { apiHandler, getUserFromReq } from 'src/utils/server-utils'

export default apiHandler()
  .post(async (req, res) => {
    const user = await getUserFromReq(req)
    if (user) {
      // invalidate a cookie named `token`
      const tokenDeleted = 'deleted'
      res.setHeader('Set-Cookie', cookie.serialize('token', tokenDeleted, {
        httpOnly: true,
        path: '/',
        maxAge: 60 * 60 * 24 * 3
      }))

      res.json({ ok: true })
    } else {
      res.json({ ok: false })
    }
  })
