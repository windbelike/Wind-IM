
export function whoami (req, res) {
  if (req.windImUser) {
    res.json({
      code: 0,
      data: req.windImUser
    })
  }
  res.json({
    code: 1,
    data: 'Please login in first.'
  })
}
