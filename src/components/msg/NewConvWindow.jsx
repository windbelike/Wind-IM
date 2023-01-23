import { useState } from 'react'
import { AiOutlinePlusCircle, AiOutlineDown, AiOutlineSearch, AiOutlineClose } from 'react-icons/ai'

export default function NewConv ({ visiable, setVisiable, userInfoContext }) {
  if (!visiable) {
    return (
      <></>
    )
  }
  const [remoteUsername, setRemoteUsername] = useState(null)
  const [conversation, setConversation] = useState(null)

  return (
    <>
      <div className='inset-0 fixed bg-gray-900 opacity-25' onClick={() => setVisiable(false)}></div>
      {/* Align center */}
      <div className='fixed mt-24 left-0 right-0 mx-auto z-10 w-full max-w-sm'>
        <div className='flex-col border border-gray-600 bg-white shadow-lg rounded-xl p-3 '>
          <div className='flex items-center justify-between'>
            <h1>Create A Conversation</h1>
            <div className='hover:cursor-pointer' onClick={() => setVisiable(false)}>
              <AiOutlineClose />
            </div>
          </div>
          <div>
            <div className='bg-white mt-5 flex justify-between items-center'>
              <input className="bg-gray-200 h-12 w-2/3 p-3 rounded-md" placeholder='Remote username' onChange={(e) => setRemoteUsername(e.target.value)}/>
              <button className='w-24 h-10 rounded-full bg-sky-500 text-white hover:bg-sky-600 px-3 shrink-0 focus:ring focus:ring-sky-300 active:bg-sky-700 focus:outline-none' onClick={() => { createConversation(userInfoContext) }}>Create</button>
            </div>
            {/* Create Conversation Status */}
            <div className='flex mt-2 items-center mx-auto w-24'>
              <div className='w-2 h-2 rounded-2xl bg-red-600'></div>
              <p className="text-slate-500 mx-1">Offline</p>
            </div>
          </div>

        </div>
      </div>
    </>
  )
}

function createConversation (name) {
  console.log('not impl yet')
}
