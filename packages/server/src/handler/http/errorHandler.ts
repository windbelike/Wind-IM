import * as Boom from '@hapi/boom'

export function errorHandler (err, req, res, next) {
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
      error: err,
      message: 'Unexpected error'
    })
  }
}
