import { prisma } from '../../utils/prismaHolder'
import { redis } from '../../utils/redisHolder'

const roomStatus = {
  normal: 0,
  deleted: 1
}

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
