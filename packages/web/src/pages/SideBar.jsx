import Link from 'next/link'
import { React, useEffect, useState } from 'react'
import { AiOutlineSetting, AiOutlineMessage, AiOutlineHome, AiOutlineUser, AiOutlineLogin, AiOutlinePlus } from 'react-icons/ai'

export default function SideBar () {
  const [addServerFlag, setAddServerFlag] = useState(false)

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

  return (
    <div>
      {addServerFlag && <AddAServer id={bgElementId} onClickCloseAddAServer={onClickCloseAddAServer} />}
      <div className='h-screen w-[72px]
      flex flex-col items-center
      bg-[#17181a] text-white shadow-lg'>
        {/* LOGO */}
        {/* <div className='my-5 shrink-0'>
          <img className="h-12 w-12 rounded-full" src="https://avatars.githubusercontent.com/u/33996345?v=4" alt="ChitChat Logo" />
        </div> */}
        {/* Main Functions */}
        <div className='mt-2'>
          <SideBarIcon linkTo='/' text='Home' icon={<AiOutlineHome size="28" />} />
          <div className=' w-[40px] h-[1px] bg-[#2f2f30] mx-4 my-2'></div>
          <div onClick={onAddAServerClick}><SideBarIcon linkTo='/channel' text='Add a Channel' icon={<AiOutlinePlus size="28" />} /></div>
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

function AddAServer ({ id, onClickCloseAddAServer }) {
  const [nextPageFlag, setNextPageFlag] = useState(false)
  const createMyOwnElementId = 'createMyOwnElement'
  const joinAServerElementId = 'joinAServerElement'
  const [currentHit, setCurrentHit] = useState(createMyOwnElementId)
  const onNextPageClick = (e) => {
    console.log('onNextPageClick')
    if (e.target.id === createMyOwnElementId) {
      console.log('createMyOwnElementId')
      setCurrentHit(createMyOwnElementId)
    } else if (e.target.id === joinAServerElementId) {
      console.log('joinAServerElementId')
      setCurrentHit(joinAServerElementId)
    } else {
      console.error('invalid click')
    }
    setNextPageFlag(true)
  }
  const onLastPageClick = () => {
    console.log('onLastPageClick')
    setNextPageFlag(false)
  }

  function CreateMyOwn () {
    return (
      <div className="flex flex-col p-2 w-[440px] h-[436px]">
        <div>CreateMyOwn</div>
        <div className="button2 mt-auto mr-auto  p-3" onClick={onLastPageClick}>
          <button>Back</button>
        </div>
      </div>
    )
  }

  function JoinAServer () {
    return (
      <div className="flex flex-col p-2 w-[440px] h-[436px]">
        <div>JoinAServer</div>
        <div className="button2 mt-auto mr-auto  p-3" onClick={onLastPageClick}>
          <button>Back</button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div onClick={onClickCloseAddAServer} id={id} className='fixed z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)] h-screen w-screen '>
        <div className={'bg-white rounded-md duration-200 overflow-hidden ' + (nextPageFlag ? 'w-[440px] h-[436px]' : 'w-[440px] h-[558px]')}>
          {/* flipping page */}
          <div
            className="w-[880px] duration-200 flex flex-nowrap"
            style={{
              transform: nextPageFlag ? 'translateX(-440px)' : 'translateX(0)'
            }}
          >
            {/* first page */}
            <div className=" flex flex-col items-center w-[440px] h-[558px]">
              {/* Header */}
              <div className='text-xl text-center font-bold w-[408px] h-[87px]'>
                <p className='mt-10'>Wanna add a channel ?</p>
              </div>
              <button id={createMyOwnElementId} className="hover:bg-gray-100 font-bold my-3 w-[406px] h-[64px] text-center rounded-3xl border-black border-[1px] " onClick={onNextPageClick}>
                Create My Own
              </button>
              <button id={joinAServerElementId} className="hover:bg-gray-100 font-bold my-3 w-[406px] h-[64px] text-center rounded-3xl border-black border-[1px] " onClick={onNextPageClick}>
               Join A Server
              </button>
            </div>
            {/* second page */}
            {/* create my own Or join a server */}
            { currentHit === createMyOwnElementId && <CreateMyOwn />}
            { currentHit === joinAServerElementId && <JoinAServer />}
          </div>
        </div>
      </div>
    </>
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
