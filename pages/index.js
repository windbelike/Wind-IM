import WelcomePage from '../src/components/WelcomePage'
import SignInOrSignUp from './entry/login'

export default function Home ({ userInfoContext }) {
  // Check if the user is signed in.
  return (
    <>
      <WelcomePage userInfoContext={userInfoContext}/>
      {/* {username ? <WelcomePage username={username} /> : <SignInOrSignUp username={username} />} */}
    </>
  )
}
