// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

import { Redis } from 'ioredis'

export default async function handler (req, res) {
  const name = await getFromRedis()
  console.log('#a hello handler, name:' + name)
  res.status(200).json({ name })
}

async function getFromRedis () {
  const redis = new Redis('redis://redis:6379')
  redis.set('foo', 'bar')
  redis.get('foo', (err, result) => {
    // `result` should be "bar"
    console.log(err, result)
  })
  return await redis.get('foo')
}
