import { useState } from 'react'
import Link from 'next/link'
import HomeSideBar from './HomeSideBar'

export default function Home ({ children }) {
  console.log('home')
  const active = true
  return (
  // <h1 className="{active? friend-active : ''} text-white">Hello Friend</h1>
    <HomeDashboard>
      <div>
        <h1>Hello Home</h1>
        <Link href='/home/friend' >
          <button>Go Friend</button>
        </Link>
        {children}
      </div>
    </HomeDashboard>
  )
}

function HomeDashboard ({ children }) {
  console.log('HomeDashboard')
  return (
    <>
      <div className='h-full p-5 bg-[#25272a] flex felx-col'>
        <HomeSideBar />
        {children}
      </div>
    </>
  )
}
