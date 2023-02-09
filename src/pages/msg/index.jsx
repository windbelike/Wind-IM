import { useState } from 'react'
import ConversationSideBar from './ConvSideBar'
import NewConv from './NewConvWindow'

export default function Msg () {
  const [visiable, setVisiable] = useState(false)
  return (
    <div className="flex h-full">
      <NewConv visiable={visiable} setVisiable={setVisiable} />
      <ConversationSideBar setVisiable={setVisiable} />
      <ConversationWindow />
    </div>
  )
}

function ConversationWindow () {
  return (
    <div className="w-full h-full flex flex-col">
      <ConversationWindowHead />
      <ConversationWindowMain />
    </div>
  )
}

function ConversationWindowHead () {
  return (
    <div className="h-24 border-b-2 border-l-2 bg-white">
      <div className='h-20 w-full p-4 flex'>
        <div className="shrink-0">
          <img className="h-12 w-12 rounded-md p-0.5" src="https://avatars.githubusercontent.com/u/33996345?v=4" alt="ChitChat Logo" />
        </div>
        <div className='pl-2 w-48'>
          <div className="text-xl font-medium text-black w-full overflow-hidden">ChitChat</div>
          {/* Status */}
          <div className='flex items-center'>
            <div className='w-2 h-2 rounded-2xl bg-green-400'></div>
            <p className="text-slate-500 mx-1">Online</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ConversationWindowMain () {
  return (
    <div className="flex-1 border-l-2 flex flex-col items-end h-0">
      <ConversationHistory />
      <Conversation2Send />
    </div>
  )
}

function Conversation2Send () {
  return (
    <div className='h-36 w-full flex justify-end items-center'>
      {/* Msg Input Box */}
      <textarea className='flex-1 p-3 m-2 h-full focus:outline-none resize-none'>

      </textarea>
      {/* Msg Send Button */}
      <button className='w-36 h-12 rounded-full bg-sky-500 text-white hover:bg-sky-600 m-5 px-5 shrink-0 focus:ring focus:ring-sky-300 active:bg-sky-700 focus:outline-none'>Send</button>
    </div>
  )
}

function ConversationHistory () {
  return (
    <div className='w-full bg-gray-100 overflow-auto flex-1'>
      <MsgByRemote />
      <MsgByMyself />
      <MsgByRemote />
      <MsgByMyself />
      <MsgByRemote />
      <MsgByMyself />
    </div>
  )
}

function MsgByRemote () {
  return (
    <div className='p-2 flex m-2'>
      <Avt />
      <MsgBox />
    </div>
  )
}

function MsgByMyself () {
  return (
    <div className='p-2 m-2 flex justify-end '>
      <MsgBox />
      <Avt />

    </div>
  )
}

function Avt () {
  return (
    <div className='shrink-0'>
      <img className="h-12 w-12 rounded-md p-0.5" src="https://avatars.githubusercontent.com/u/33996345?v=4" alt="ChitChat Logo" />
    </div>
  )
}

function MsgBox () {
  return (
    <div className='bg-white rounded-md mx-1 p-3 w-48'>
      <p>Hi there, you have a new message ! you have a new message !you have a new message !you have a new message !you have a new message !you have a new message !you have a new message !you have a new message !you have a new message !you have a new message !you have a new message !you have a new message !you have a new message !you have a new message !you have a new message !you have a new message !you have a new message !you have a new message !</p>
    </div>
  )
}
