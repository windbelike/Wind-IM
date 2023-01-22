import { useEffect, useState } from 'react'

export default function WelcomePage ({ userInfoContext }) {
  const [username, setUsername] = useState('x')
  console.log('WelcomePage...' + username)
  useEffect(() => {
    console.log('use WelcomePage effect')
    setUsername(userInfoContext.username)
    return () => {
      console.log('unmount')
    }
  }, [])

  return (
    <div className="flex h-full w-full justify-center items-center">
      <div className=" bg-sky-50 text-9xl"><h1 >Welcome, {username}</h1></div>
    </div>
  )
}
