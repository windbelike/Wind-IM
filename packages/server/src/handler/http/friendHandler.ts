import { getFirendList } from '@/service/friend/friendService'

export async function friendGet (req, res, next) {
  try {
    const user = req.windImUser
    res.json({ data: await getFirendList(user.id) })
  } catch (e) {
    next(e)
  }
}
