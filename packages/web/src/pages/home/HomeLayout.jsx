import { useState, cloneElement } from 'react'
import HomeSideBar from './HomeSideBar'

export default function HomeLayout ({ children }) {
  const sideBarActiveState = useState('')
  const childrenWithProps = cloneElement(children, { sideBarActiveState })
  return (
    <>
      <div className='h-full w-full bg-[#25272a] flex'>
        <HomeSideBar sideBarActiveState={sideBarActiveState}/>
        {childrenWithProps}
      </div>
    </>
  )
}

// const getPage = (page) => page
