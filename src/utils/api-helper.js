import * as Boom from '@hapi/boom'
import nc from 'next-connect'

// next-connect的boom封装
export default () => nc({
  onError (err, req, res) {
    console.log('#apiHelper')
    console.error(err)
    // 如果是一个 Boom 异常，则根据 Boom 异常结构修改 `res`
    if (Boom.isBoom(err)) {
      res.status(err.output.payload.statusCode)
      res.json({
        error: err.output.payload.error,
        message: err.output.payload.message
      })
    } else {
      res.status(500)
      res.json({
        message: 'Unexpected error'
      })
      console.error(err)
    }
  }
})
