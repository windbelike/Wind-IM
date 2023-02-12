import { apiHandler, loginValidator } from 'src/utils/server-utils'
import { getFirendList } from '@/services/FriendService'

export default apiHandler()
  .get(loginValidator, async (req, res) => {
    const user = req.windImUser
    res.json({ data: await getFirendList(user.id) })
  })
