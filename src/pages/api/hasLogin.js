import { apiHandler, loginValidator } from 'src/utils/server-utils'

export default apiHandler()
  .get(loginValidator, async (req, res) => {
    if (req.windImUser) {
      res.json({
        msg: 'ok',
        user: req.windImUser
      })
    }
  })
