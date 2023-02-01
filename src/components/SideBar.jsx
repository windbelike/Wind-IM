import Link from 'next/link'
import { React } from 'react'
import { AiOutlineSetting, AiOutlineMessage, AiOutlineHome, AiOutlineUser, AiOutlineLogin } from 'react-icons/ai'

export default function SideBar () {
  return (
    <div>
      <div className='h-screen w-16 m-0
      flex flex-col justify-end items-center
      bg-black text-white shadow-lg'>
        {/* LOGO */}
        <div className='my-5 shrink-0'>
          <img className="h-12 w-12 rounded-md p-0.5" src="https://avatars.githubusercontent.com/u/33996345?v=4" alt="ChitChat Logo" />
        </div>
        {/* Main Functions */}
        <div className='flex-1'>
          <SideBarIcon linkTo='/' text='Home' icon={<AiOutlineHome size="28" />} />
          <SideBarIcon linkTo='/msg' text='Messages' icon={<AiOutlineMessage size="28" />} />
          <SideBarIcon linkTo='/user/profile' text='Profile' icon={<AiOutlineUser size="28" />} />
          <SideBarIcon linkTo='/entry/logout' text='Logout' icon={<AiOutlineLogin size="28" />} />
        </div>
        {/* Bottom Function */}
        <SideBarIcon linkTo='/settings' icon={<AiOutlineSetting size="28" />} />
      </div>
    </div>
  )
}

const SideBarIcon = ({ icon, text = 'tooltip 💡', linkTo = '/' }) => (
  <Link href={linkTo} >
    <div className="sidebar-icon m-3 group">
      {icon}
      {/* Styling based on parent state (group-{modifier}) */}
      <span className="sidebar-tooltip group-hover:scale-100">{text}</span>
    </div>
  </Link>
)
