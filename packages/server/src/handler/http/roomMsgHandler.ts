import { findRoom, findRoomsByChannelId } from '@/service/room/roomService'

// get all channel I joined info
export async function roomListGet (req, res, next) {
  try {
    const user = req.windImUser
    const result = await findRoomsByChannelId(parseInt(req.query?.channelId))
    res.json({ data: result })
  } catch (e) {
    next(e)
  }
}

export async function roomGet (req, res, next) {
  try {
    const user = req.windImUser
    const room = await findRoom(parseInt(req.query?.roomId))
    res.json({ data: room, code: 200 })
  } catch (e) {
    next(e)
  }
}
