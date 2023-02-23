import { Redis } from 'ioredis'

async function main () {
  console.log(await write2Redis('a', 'b'))
  return 0
}

async function write2Redis (key, val) {
  const redis = new Redis()

  return await redis.set(key, val)
}
test('redis rw test', async () => {
  expect(await main()).toBe(0)
})
