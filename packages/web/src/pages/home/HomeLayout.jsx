import { useState } from 'react'
import HomeSideBar from './HomeSideBar'

export default function HomeLayout ({ children }) {
  const sideBarActiveState = useState('')
  // const Children = children
  // const c = <Children sideBarActiveState={sideBarActiveState} />
  return (
    <>
      <div className='h-full w-full bg-[#25272a] flex'>
        <HomeSideBar />
        {/* todo pass sideBarActiveState to children as props */}
        {children}
      </div>
    </>
  )
}

// const getPage = (page) => page
