import url from 'node:url'
import querystring from 'node:querystring'
import { Redis } from 'ioredis'

export default async function handler (req, res) {
  const queryObj = url.parse(req.url).query
  const urlParams = querystring.parse(queryObj)
  console.log('urlParams:' + JSON.stringify(urlParams))
  const val = await getFromRedis(urlParams.key)
  res.status(200).json(val)
}

async function getFromRedis (key) {
  const redis = new Redis()
  return await redis.get(key)
}
