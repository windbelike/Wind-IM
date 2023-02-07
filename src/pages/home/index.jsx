import { useState } from 'react'
import Link from 'next/link'

export default function Home ({ children }) {
  const active = true
  return (
  // <h1 className="{active? friend-active : ''} text-white">Hello Friend</h1>

    <>
      <h1>Hello Home</h1>
      <Link href='/home/friend' >
        <button>Go Friend</button>
      </Link>
      {children}
    </>
  )
}
