import { prisma } from '../src/utils/prismaHolder'

async function findUser () {
  const users = await prisma.user.findMany()
  console.log(JSON.stringify(users))
}

test('mock test', () => {
  expect(true).toBe(true)
})
