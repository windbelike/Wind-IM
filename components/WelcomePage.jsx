
export default function WelcomePage ({ userInfoContext }) {
  if (userInfoContext.username == null) {
    userInfoContext.username = 'Anonymous'
  }
  return (
    <div className="flex h-full w-full justify-center items-center">
      <div className=" bg-sky-50 text-9xl"><h1 >Welcome, {userInfoContext.username}</h1></div>
    </div>
  )
}
