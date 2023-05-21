import { Redis } from 'ioredis'

let redis:Redis

const devRedisUrl = ''
const betaRedisUrl = 'redis://redis:6379'
const prodRedisUrl = ''

try {
  console.log('WINDIM_ENV: ' + process.env.WINDIM_ENV)
  let redisUrl = ''
  if (process.env.WINDIM_ENV === 'dev') {
    redisUrl = devRedisUrl
  } else if (process.env.WINDIM_ENV === 'beta') {
    redisUrl = betaRedisUrl
  } else if (process.env.WINDIM_ENV === 'prod') {
    redisUrl = prodRedisUrl
  } else {
    redisUrl = devRedisUrl
  }

  redis = new Redis(redisUrl)
} catch (e) {
  console.error(e)
}

export { redis }
