import axios from '@/utils/axiosUtils'
import { useQuery } from 'react-query'

async function whoami () {
  const data = await axios.get('/api/whoami')
  return data.data
}

export default function Profile () {
  const { isLoading, error, data } = useQuery('whoami', whoami)
  return (
    <>
      {isLoading && <p>Loading</p>}
      {data &&
      <div>
        <h1>Hello, {data.data?.email}</h1>
      </div>
      }
      {error && <p>error</p>}
    </>

  )
}

// export async function getServerSideProps (ctx) {
//   const user = await getUserFromReq(ctx.req)
//   if (!user) {
//     return {
//       redirect: {
//         permanent: false,
//         destination: '/entry'
//       }
//     }
//   }
//   return {
//     props: {
//       user: {
//         email: user.email
//       }
//     }
//   }
// }
