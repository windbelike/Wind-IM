import { React } from 'react'
import { BsPlus, BsFillLightningFill } from 'react-icons/bs'
import { FaFire, FaPoo } from 'react-icons/fa'

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
        <SideBarIcon icon={<FaFire size="28" />} />
        <SideBarIcon icon={<BsPlus size="32" />} />
        <SideBarIcon icon={<BsFillLightningFill size="20" />} />
        <SideBarIcon icon={<FaPoo size="20" />} />
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
