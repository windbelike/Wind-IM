import { Redis } from 'ioredis'

let redis:Redis

try {
  redis = new Redis()
} catch (e) {
  console.error(e)
}

export { redis }
