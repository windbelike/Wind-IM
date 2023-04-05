import Link from 'next/link'
import { React, useEffect, useRef, useState } from 'react'
import { AiOutlineSetting, AiOutlineCompass, AiOutlineHome, AiOutlineUser, AiOutlineLogin, AiOutlinePlus } from 'react-icons/ai'
import AddAChannelBg from './channel/AddAChannelBg'
import ChannelAvatar from '@/components/ChannelAvatar'
import { useQuery } from 'react-query'
import { getChannelList } from '@/utils/apiUtils'

export default function Sidebar () {
  const [addServerFlag, setAddServerFlag] = useState(false)
  const { data, error, isLoading } = useQuery('getChannelList', getChannelList)
  const tabState = useState('/')

  function onAddAServerClick () {
    setAddServerFlag(true)
    console.log('onAddAServerClick, addServerFlag:' + addServerFlag)
  }

  const bgElementId = 'AddAServerBg'
  const cancelElementId = 'cancelAddAServer'

  function onClickCloseAddAServer (e) {
    if (e.target.id === bgElementId || e.target.id === cancelElementId) {
      setAddServerFlag(false)
    }
  }

  function AddAChannelIcon () {
    return (
      <div onClick={onAddAServerClick}><div className="sidebar-icon group">
        <AiOutlinePlus size="28" />
        {/* Styling based on parent state (group-{modifier}) */}
        <span className="sidebar-tooltip group-hover:scale-100">Add a channel</span>
      </div></div>
    )
  }

  return (
    <div>
      {addServerFlag && <AddAChannelBg id={bgElementId} onClickCloseAddAServer={onClickCloseAddAServer} />}
      {/* todo 解决overflow icon不展示的问题 && overflow-hidden icon的tooltip不展示 */}
      <div className='
      h-full
      w-[72px]
      flex flex-col items-center
      bg-[#17181a] text-white shadow-lg'>
        {/* LOGO */}
        {/* <div className='my-5 shrink-0'>
          <img className="h-12 w-12 rounded-full" src="https://avatars.githubusercontent.com/u/33996345?v=4" alt="ChitChat Logo" />
        </div> */}
        {/* Main Functions */}
        <SidebarIcon linkTo='/' text='Home' icon={<AiOutlineHome size="28" />} tabState ={tabState} />
        <div className='shrink-0 w-[40px] h-[1px] bg-[#2f2f30] mx-4 my-2'></div>
        <ChannelIconList data={data}/>
        <AddAChannelIcon />
        <SidebarIcon linkTo='/explore' text='Explore' icon={<AiOutlineCompass size="28"/>} tabState ={tabState}/>
        <SidebarIcon linkTo='/user/profile' text='Profile' icon={<AiOutlineUser size="28"/>} tabState ={tabState}/>
        {/* <SideBarIcon linkTo='/entry/login' text='Profile' icon={<AiOutlineUser size="28" />} /> */}
        <SidebarIcon linkTo='/entry/logout' text='Logout' icon={<AiOutlineLogin size="28" />} tabState ={tabState}/>
        <div className="mt-auto">
          <SidebarIcon linkTo='/settings' text="Settings" icon={<AiOutlineSetting size="28" />} tabState ={tabState}/>
        </div>
      </div>
    </div>
  )
}

function ChannelIconList ({ data }) {
  return (
    <div className='flex flex-col items-center'>
      {data?.data?.map((channel) => {
        return (
          <Link href={'/channel/' + channel.channelId} key={channel.channelId}>
            <div className='hover:cursor-pointer sidebar-icon group m-1'>
              <ChannelAvatar name={channel.channelRel.name}/>
              <span className="sidebar-tooltip group-hover:scale-100">{channel.channelRel.name}</span>
            </div>
          </Link>
        )
      })}
    </div>
  )
}

function SidebarIcon ({ icon, text = 'tooltip 💡', linkTo = '/', tabState }) {
  const [tab, setTab] = tabState
  function onSidebarIconClick () {
    setTab(linkTo)
  }

  return (
    <div onClick={onSidebarIconClick}>
      <Link href={linkTo} >
        <div className={`sidebar-icon group overflow-x-visible ${tab == linkTo ? 'sidebar-active' : ''}`}>
          {icon}
          {/* Styling based on parent state (group-{modifier}) */}
          <span className="sidebar-tooltip group-hover:scale-100">{text}</span>
        </div>
      </Link>
    </div>
  )
}
