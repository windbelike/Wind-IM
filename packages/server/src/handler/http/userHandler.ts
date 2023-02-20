
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
