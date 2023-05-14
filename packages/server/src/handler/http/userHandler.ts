import { respCode, responseType } from './../../types/response'
import { onlineHeartbeat } from '@/service/user/userService'

export function whoami (req, res, next) {
  try {
    if (req.windImUser) {
      res.json({
        code: 0,
        data: req.windImUser
      })
    } else {
      res.json({
        code: 1,
        data: 'Please login in first.'
      })
    }
  } catch (e) {
    next(e)
  }
}

export function onlineHeartbeatGet (req, res, next) {
  try {
    let resp: responseType
    if (!req.windImUser) {
      resp = {
        code: respCode.sysError
      }
    } else {
      onlineHeartbeat(req.windImUser.id)
      resp = { code: respCode.successCode }
    }
    res.json(resp)
  } catch (e) {
    next(e)
  }
}

export function batchCheckUserOnlineGet (req, res, next) {
  try {
    res.json({ })
  } catch (e) {
    next(e)
  }
}
