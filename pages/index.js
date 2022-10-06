import Conv from '../components/Conv'
import SignInOrSignUp from './user/login'

export default function Home ({ username }) {
  // Check if the user is signed in.

  return (
    <>
      {username ? <Conv username={username} /> : <SignInOrSignUp username={username} />}
    </>
  )
}
