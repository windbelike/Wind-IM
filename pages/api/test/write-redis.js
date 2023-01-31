import url from 'node:url'
import querystring from 'node:querystring'
import { Redis } from 'ioredis'

export default async function handler (req, res) {
  const queryObj = url.parse(req.url).query
  const urlParams = querystring.parse(queryObj)
  const val = await write2Redis(urlParams.key, urlParams.val)
  res.status(200).json(val)
}

async function write2Redis (key, val) {
  const redis = new Redis()
  return await redis.set(key, val)
}
