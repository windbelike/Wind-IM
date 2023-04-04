import { findRoomsByChannelId } from '@/service/room/roomService'

// get all channel I joined info
export async function roomListGet (req, res, next) {
  try {
    const user = req.windImUser
    const result = await findRoomsByChannelId(parseInt(req.query?.channelId))
    console.log('#roomListGet roomListGet' + JSON.stringify(result))
    res.json({ data: result })
  } catch (e) {
    next(e)
  }
}
