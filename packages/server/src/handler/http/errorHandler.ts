import * as Boom from '@hapi/boom'

const loginErrorCode = 403
const loginErrorMsg = 'Please login first.'

export function errorHandler (err, req, res, next) {
  console.error(err)
  // 如果是一个 Boom 异常，则根据 Boom 异常结构修改 `res`
  if (Boom.isBoom(err)) {
    // login error
    if (err.output.payload.statusCode == loginErrorCode) {
      res.status(loginErrorCode)
      res.json({
        error: loginErrorCode,
        message: loginErrorMsg
      })
    } else {
      // other boom error
      res.status(err.output.payload.statusCode)
      res.json({
        error: err.output.payload.error,
        message: err.output.payload.message
      })
    }
  } else {
    res.status(500)
    res.json({
      error: err,
      message: 'Unexpected error'
    })
  }
}
