const { signup } = require('../dist/service/user/userService')

async function createTestUsers () {
  for (let i = 0; i < 50; i++) {
    const email = `${i.toString()}@gmail.com`
    const name = i.toString()
    const res = await signup(email, name, '1')
    console.log(res)
  }

  let email = 'sawyer@gmail.com'
  let name = 'sawyer'
  let res = await signup(email, name, '1')
  console.log(res)

  email = 'wind@gmail.com'
  name = 'wind'
  res = await signup(email, name, '1')
  console.log(res)
}

test('create User test', async () => {
  await createTestUsers()
  expect(true).toBe(true)
})
