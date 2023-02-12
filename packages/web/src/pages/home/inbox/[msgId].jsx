import { useState } from 'react'
import { useRouter } from 'next/router'
import { HomeDashboard } from '..'

export default function Inbox () {
  const router = useRouter()
  const { msgId } = router.query

  return (
    <HomeDashboard>
      <div className='p-5'>
        <p className='text-white'>msgId: {msgId}</p>

      </div>
    </HomeDashboard>
  )
}
