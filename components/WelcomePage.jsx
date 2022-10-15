
export default function WelcomePage ({ username }) {
  if (username == null) {
    username = 'Anonymous'
  }
  return (
    <div className="flex h-full w-full justify-center items-center">
      <div className=" bg-sky-50 text-9xl"><h1 >Welcome, {username}.</h1></div>
    </div>
  )
}
