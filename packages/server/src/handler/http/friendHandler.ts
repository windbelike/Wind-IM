import { getFriendList, getOnlineFriendList } from '@/service/friend/friendService'

export async function friendGet (req, res, next) {
  try {
    const user = req.windImUser
    const result = await getFriendList(user.id)

    res.json({ data: result })
  } catch (e) {
    next(e)
  }
}

export async function onlineFriendsGet (req, res, next) {
  try {
    const user = req.windImUser
    const result = await getOnlineFriendList(user.id)

    res.json({ data: result })
  } catch (e) {
    next(e)
  }
}
