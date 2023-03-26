import { createChannel, getChannelListByUid, selectChannelById } from '@/service/channel/channelService'

export async function channelPost (req, res, next) {
  // create channel
  try {
    const user = req.windImUser
    const body = req.body
    const channel = await createChannel(user.id, body.name, body.desc)
    if (channel) {
      res.json({ code: 0, message: 'succeed' })
    } else {
      res.json({ code: 1, message: 'error' })
    }
  } catch (e) {
    next(e)
  }
}

export async function channelGet (req, res, next) {
  try {
    const user = req.windImUser
    const body = req.body
    res.json({ data: await getChannelListByUid(body.channelId) })
  } catch (e) {
    next(e)
  }
}
