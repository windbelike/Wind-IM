import { Redis } from 'ioredis'

async function main () {
  console.log(await getFromRedis('a'))
  return 0
}

async function getFromRedis (key) {
  const redis = new Redis()
  return await redis.get(key)
}

test('read-redis test', async () => {
  expect(await main()).toBe(0)
})
