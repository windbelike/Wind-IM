import { Redis } from 'ioredis'
import { v4 as uuidv4 } from 'uuid'

const redis = new Redis()

const key = uuidv4()
const value = uuidv4()

async function main () {
  await write2Redis(key, value)
  return await getFromRedis(key)
}

test('redis rw test', async () => {
  expect(await main()).toBe(value)
})

async function getFromRedis (key) {
  const redis = new Redis()
  return await redis.get(key)
}

async function write2Redis (key, val) {
  return await redis.set(key, val)
}
