import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcrypt'
export default async function handler (req, res) {
  const body = req.body
  console.log(body)
  const prisma = new PrismaClient()
  const created = await prisma.user.create({
    data: {
      email: body.email,
      pwd: bcrypt.hashSync(body.pwd, 10)
    }
  })
  res.json({
    code: 200,
    message: 'success'
  })
}
