import { prisma } from '../../utils/prismaHolder'
import { redis } from '../../utils/redisHolder'

export const roomStatus = {
  normal: 0,
  deleted: 1
}

const roomMsgType = 1

// Room is a notion of volatile group of users, which online status can be stored in some cache such as Redis.
// Text room only currently.

// join a room, use redis set to store who is in the room
// todo add lock
export async function joinRoom (uid, roomId) {
  // check if room exists
  const room = await findRoom(roomId)
  if (!room) {
    throw new Error('Room not found')
  }
  const roomMembers = await getRoomMembers(roomId)
  roomMembers.push(uid)
  redis.sadd(buildRoomMemberKey(roomId), roomMembers)
}

async function getRoomMembers (roomId) {
  return await redis.smembers(buildRoomMemberKey(roomId))
}

function buildRoomMemberKey (roomId) {
  return `room_member_${roomId}`
}

// create a room
export async function createRoom ({ name, desc, creatorId, channelId }) {
  return await prisma.room.create({
    data: {
      name,
      desc,
      status: roomStatus.normal,
      creatorUidRel: {
        connect: { id: creatorId }
      },
      channelRel: {
        connect: { id: channelId }
      }
    }
  })
}

// find room by roomId
export async function findRoom (roomId) {
  return await prisma.room.findUnique({
    where: {
      id: roomId
    }
  })
}

// find rooms by channelId
export async function findRoomsByChannelId (channelId) {
  if (!Number.isFinite(channelId)) {
    throw new Error('Illegal channelId.')
  }

  return await prisma.room.findMany({
    where: {
      channelId,
      status: roomStatus.normal
    }
  })
}

// create a default room
export function createDefaultRoom ({ creatorId, channelId }) {
  const name = 'Default Room'
  const desc = 'A Default Text Room'
  return createRoom({ name, desc, creatorId, channelId })
}

// delete a room
export async function deleteRoom (roomId) {
  return await prisma.room.update({
    where: {
      id: roomId
    },
    data: {
      status: roomStatus.deleted
    }
  })
}

// persist room msg
export async function persistRoomMsg (roomId, fromUid, content) {
  try {
    return await prisma.message.create({
      data: {
        fromUidRel: { connect: { id: fromUid } },
        roomId,
        content,
        msgType: roomMsgType,
        pushed: true,
        read: true
      },
      select: {
        id: true,
        fromUid: true,
        content: true,
        createdAt: true,
        fromUidRel: {
          select: {
            username: true
          }
        }
      }
    })
  } catch (e) {
    console.error(e)
  }
}

// fetch all missed room msg
export async function fetchAllMissedRoomMsg (roomId, offset) {
  try {
    return await prisma.message.findMany({
      select: {
        id: true,
        fromUid: true,
        fromUidRel: {
          select: {
            username: true
          }
        },
        createdAt: true,
        roomId: true,
        content: true
      },
      where: {
        id: {
          gt: offset
        },
        roomId
      }
    })
  } catch (e) {
    console.log(e)
  }
}
