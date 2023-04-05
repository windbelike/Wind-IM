import HomeSideBar from './HomeSideBar'

export default function HomeLayout ({ children }) {
  return (
    <>
      <div className='h-full w-full bg-[#25272a] flex'>
        <HomeSideBar />
        {children}
      </div>
    </>
  )
}
