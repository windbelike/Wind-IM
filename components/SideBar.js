import Link from 'next/link'
import { React } from 'react'
import { AiOutlineSetting, AiOutlineMessage, AiOutlineHome, AiOutlineSearch } from 'react-icons/ai'

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
        <Link href='/' passHref>
          <a>Home</a>
        </Link>
        <SideBarIcon icon={<AiOutlineHome size="28" />} />
        <SideBarIcon icon={<AiOutlineMessage size="32" />} />
        <SideBarIcon icon={<AiOutlineSearch size="20" />} />
        <SideBarIcon icon={<AiOutlineSetting size="20" />} />
      </div>
    </div>
  )
}

const SideBarIcon = ({ icon, text = 'tooltip 💡' }) => (
  <div className="sidebar-icon group">
    {icon}
    <span className="sidebar-tooltip group-hover:scale-100">{text}</span>
  </div>
)
