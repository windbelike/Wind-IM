import cookie from 'cookie'

export async function logoutPost (req, res, next) {
  try {
    if (req.windImUser) {
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
  } catch (e) {
    next(e)
  }
}
