import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// https://www.prisma.io/docs/concepts/components/prisma-client/crud
async function main () {
  const user = await prisma.user.findUnique({
    where: {
      email: 'sawyer'
    }
  })
  console.log(JSON.stringify(user))
}

main()
