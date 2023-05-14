import { useState } from 'react'
import HomeSideBar from './HomeSideBar'

export default function HomeLayout ({ children }) {
  const sideBarActiveState = useState('')
  return (
    <>
      <div className='h-full w-full bg-[#25272a] flex'>
        <HomeSideBar />
        {children}
      </div>
    </>
  )
}
