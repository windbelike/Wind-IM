import Link from 'next/link'
import { React } from 'react'
import { AiOutlineSetting, AiOutlineMessage, AiOutlineHome, AiOutlineUser } from 'react-icons/ai'

export default function SideBar () {
  return (
    <div>
      {/* <p className='text-center text-purple-500 font-bold text-9xl'>Hello World !</p> */}
      {/* <div className='flex items-center justify-center'>
        <FaAccessibleIcon />
      </div> */}
      <div className=' h-screen w-16 m-0
      flex flex-col
      bg-black text-white shadow-lg'>
        <SideBarIcon linkTo='/' text='Home' icon={<AiOutlineHome size="28" />} />
        <SideBarIcon linkTo='/msg' text='Messages' icon={<AiOutlineMessage size="28" />} />
        <SideBarIcon linkTo='/user/profile' test='Profile' icon={<AiOutlineUser size="28" />} />
        <SideBarIcon linkTo='/settings' icon={<AiOutlineSetting size="28" />} />
      </div>
    </div>
  )
}

const SideBarIcon = ({ icon, text = 'tooltip 💡', linkTo = '/' }) => (
  <Link href={linkTo}>
    <div className="sidebar-icon group">
      {icon}
      <span className="sidebar-tooltip group-hover:scale-100">{text}</span>
    </div>
  </Link>
)
