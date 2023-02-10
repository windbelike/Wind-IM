import HomeSideBar from './HomeSideBar'

export default function Home () {
  const active = true
  return (
  // <h1 className="{active? friend-active : ''} text-white">Hello Friend</h1>
    <HomeDashboard />
  )
}

export function HomeDashboard ({ children }) {
  return (
    <>
      <div className='h-full w-full p-5 bg-[#25272a] flex'>
        <HomeSideBar />
        {children}
      </div>
    </>
  )
}
