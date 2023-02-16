import { useEffect } from 'react'
import HomeSideBar from './HomeSideBar'

export default function HomeDashboard ({ children }) {
  return (
    <>
      <div className='h-full w-full p-5 bg-[#25272a] flex'>
        <HomeSideBar />
        {children}
      </div>
    </>
  )
}
