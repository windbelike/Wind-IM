import { Redis } from 'ioredis'

let redis

try {
  redis = new Redis()
} catch (e) {
  console.error(e)
}

export { redis }
