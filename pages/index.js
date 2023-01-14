import WelcomePage from '../components/WelcomePage'
import SignInOrSignUp from './user/login'

export default function Home ({ userInfoContext }) {
  // Check if the user is signed in.
  return (
    <>
      <WelcomePage userInfoContext={userInfoContext}/>
      {/* {username ? <WelcomePage username={username} /> : <SignInOrSignUp username={username} />} */}
    </>
  )
}
