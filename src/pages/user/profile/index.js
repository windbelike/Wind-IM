import { getUserFromReq } from '../../../utils/server-utils'

export default function Profile ({ user }) {
  return (
    <div>
      <h1>Hello, {user.email}</h1>
    </div>
  )
}

export async function getServerSideProps (ctx) {
  const user = await getUserFromReq(ctx.req)
  if (!user) {
    return {
      redirect: {
        permanent: false,
        destination: '/entry'
      }
    }
  }
  return {
    props: {
      user: {
        email: user.email
      }
    }
  }
}
