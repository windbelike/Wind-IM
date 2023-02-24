import Link from 'next/link'
import { React, useEffect } from 'react'
import { AiOutlineSetting, AiOutlineMessage, AiOutlineHome, AiOutlineUser, AiOutlineLogin, AiOutlinePlus } from 'react-icons/ai'

export default function SideBar () {
  return (
    <div>
      <div className='h-screen w-[72px]
      flex flex-col items-center
      bg-[#17181a] text-white shadow-lg'>
        {/* LOGO */}
        {/* <div className='my-5 shrink-0'>
          <img className="h-12 w-12 rounded-full" src="https://avatars.githubusercontent.com/u/33996345?v=4" alt="ChitChat Logo" />
        </div> */}
        {/* Main Functions */}
        <div className=''>
          <SideBarIcon linkTo='/' text='Home' icon={<AiOutlineHome size="28" />} />
          <div className=' w-[40px] h-[1px] bg-[#2f2f30] mx-4 my-2'></div>
          <SideBarIcon linkTo='/channel' text='Add a Channel' icon={<AiOutlinePlus size="28" />} />
          <SideBarIcon linkTo='/msg' text='Messages' icon={<AiOutlineMessage size="28" />} />
          <SideBarIcon linkTo='/user/profile' text='Profile' icon={<AiOutlineUser size="28" />} />
          {/* <SideBarIcon linkTo='/entry/login' text='Profile' icon={<AiOutlineUser size="28" />} /> */}
          <SideBarIcon linkTo='/entry/logout' text='Logout' icon={<AiOutlineLogin size="28" />} />
        </div>
        <div className="mt-auto">
          <SideBarIcon linkTo='/settings' text="Settings" icon={<AiOutlineSetting size="28" />} />
        </div>
      </div>
    </div>
  )
}

const SideBarIcon = ({ icon, text = 'tooltip 💡', linkTo = '/' }) => (
  <Link href={linkTo} >
    <div className="sidebar-icon group">
      {icon}
      {/* Styling based on parent state (group-{modifier}) */}
      <span className="sidebar-tooltip group-hover:scale-100">{text}</span>
    </div>
  </Link>
)
