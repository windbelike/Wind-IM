
// 测试next-connect中间件

import nc from 'next-connect'

function authMiddleware (req, res, next) {
  res.status(403)
  res.send('please sign in first')
  // next()
}

export default nc()
  .get((req, resp) => {
    resp.send('hello')
  })
  .post(authMiddleware, (req, resp) => {
    resp.send('hello')
  })
