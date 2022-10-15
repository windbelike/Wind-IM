import WelcomePage from '../components/WelcomePage'
import SignInOrSignUp from './user/login'

export default function Home ({ username }) {
  // Check if the user is signed in.
  return (
    <>
      <WelcomePage username={username}/>
      {/* {username ? <WelcomePage username={username} /> : <SignInOrSignUp username={username} />} */}
    </>
  )
}
