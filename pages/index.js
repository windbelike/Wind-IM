import WelcomePage from '../src/components/WelcomePage'

export default function Home ({ userInfoContext }) {
  return (
    <>
      <WelcomePage userInfoContext={userInfoContext}/>
    </>
  )
}
