import { AiOutlinePlusCircle, AiOutlineDown, AiOutlineSearch } from 'react-icons/ai'

export default function Msg () {
  return (
    <div className="flex h-full">
      <ConversationSideBar />
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

function ConversationHistory () {
  return (
    <div className='bg-gray-500 w-full overflow-auto '>
      <MsgByRemote />
      <MsgByRemote /><MsgByRemote /><MsgByRemote /><MsgByRemote /><MsgByRemote /><MsgByRemote /><MsgByRemote /><MsgByRemote /><MsgByRemote /><MsgByRemote /><MsgByRemote /><MsgByRemote /><MsgByRemote /><MsgByRemote /><MsgByRemote /><MsgByRemote /><MsgByRemote /><MsgByRemote /><MsgByRemote /><MsgByRemote /><MsgByRemote /><MsgByRemote /><MsgByRemote /><MsgByRemote /><MsgByRemote /><MsgByRemote /><MsgByRemote /><MsgByRemote /><MsgByRemote /><MsgByRemote /><MsgByRemote /><MsgByRemote /><MsgByRemote /><MsgByRemote />
    </div>
  )
}

function MsgByRemote () {
  return (
    <div className='bg-sky-500 w-full h-24 border-2 border-sky300'>
      <Avt />
      <MsgBox />
    </div>
  )
}

function MsgByMyself () {
  return (
    <div className='bg-violet-500 w-full h-24'>
      {/*  */}
    </div>
  )
}

function Avt () {
  return (
    <div>

    </div>
  )
}

function MsgBox () {
  return (
    <div>

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

function ConversationSideBar () {
  return (
    <div className="w-72 h-full bg-white shrink-0 flex flex-col">
      {/* Head */}
      <div className="border-t-0 border-b-2 border-solid h-18 flex items-center justify-between">
        <div className='w-48 flex items-center'>
          <p className="pl-5 text-xl font-medium ">Messages</p>
          <AiOutlineDown size="20" className="pr-5 h-9 w-9"/>
        </div>
        <AiOutlinePlusCircle className="pr-5 h-12 w-12 shrink-0"/>
      </div>
      {/* Conversation SideBar */}
      {/* todo hide the scrollbar & overflow-scroll  */}
      <div className='flex-1 flex flex-col h-0'>
        {/* Search Window */}
        <div className='flex items-center'>
          <input className="bg-gray-200 h-12 w-10/12 m-3 p-3 rounded-md" placeholder='Search messages'/>
          <AiOutlineSearch size="28" className="h-10 w-10 opacity-30 mr-5 inline shrink-0 hover:cursor-pointer hover:text-sky-500"/>
        </div>
        {/* Conversation Card List */}
        <div className='overflow-scroll flex-1 h-0 no-scrollbar'>
          <ConversationCard />
          <ConversationCard />
        </div>
      </div>
    </div>
  )
}

function ConversationCard () {
  return (
    <div className='h-20 w-full p-4 hover:shadow-lg rounded-lg hover:bg-sky-100 hover:cursor-pointer flex focus:ring focus:ring-sky-200 active:bg-sky-300'>
      <div className="shrink-0">
        <img className="h-12 w-12 rounded-md p-0.5" src="https://avatars.githubusercontent.com/u/33996345?v=4" alt="ChitChat Logo" />
      </div>
      <div className='pl-2 w-48'>
        <div className="text-xl font-medium text-black w-full ">ChitChat</div>
        <p className="text-slate-500 truncate">You have a new message! blablablabla</p>
      </div>
    </div>
  )
}
