import * as Boom from '@hapi/boom'
import nc from 'next-connect'
import { PrismaClient } from '@prisma/client'
import jwt from 'jsonwebtoken'

// todo db命名风格更改、service封装、单测

// db client
export const prisma = new PrismaClient()

// General response
const resp = {
  code: 0,
  data: {},
  err: {}
}

export const loginValidator = async (req, res, next) => {
  // to validate if current use have already logined.
  const user = await getUserFromReq(req)
  if (!user) {
    throw Boom.forbidden('Please login in first')
  }
  req.windImUser = user
  next()
}
// hanlde authorization
export const getUserFromReq = async (req) => {
  // get JWT `token` on cookies
  const token = req.cookies.token
  try {
    // if token is invalid, `verify` will throw an error
    const payload = jwt.verify(token, process.env.JWT_SECRET)
    // find user in database
    const user = await prisma.user.findUnique({
      select: {
        id: true,
        email: true,
        bio: true,
        username: true
      },
      where: {
        email: payload.email
      }
    })
    return user
  } catch (e) {
    return null
  }
}

// next-connect的boom封装
export function apiHandler () {
  return nc({
    onError (err, req, res) {
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
  })
}
