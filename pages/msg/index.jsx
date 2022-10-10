import { AiOutlinePlusCircle, AiOutlineDown, AiOutlineSearch } from 'react-icons/ai'

export default function Msg () {
  return (
    <div className="flex h-full overflow-hidden">
      <ConversationSideBar />
      <ConversationWindow />
    </div>
  )
}

function ConversationWindow () {
  return (
    <div className="w-full ">
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
    <div className="w-full h-full bg-orange-200">
      <ConversationReceived />
      <Conversation2Send />
    </div>
  )
}

function ConversationReceived () {

}

function Conversation2Send () {

}

function ConversationSideBar () {
  return (
    <div className="w-72 h-full bg-white shrink-0">
      {/* Head */}
      <div className="border-t-0 border-b-2 border-b-gray-100 border-solid h-24 flex items-center justify-between">
        <div className='w-48 flex items-center'>
          <p className="pl-5 text-xl font-medium ">Messages</p>
          <AiOutlineDown size="20" className="pr-5 h-9 w-9"/>
        </div>
        <AiOutlinePlusCircle className="pr-5 h-12 w-12 shrink-0"/>
      </div>
      {/* Conversation SideBar */}
      {/* todo hide the scrollbar & overflow-scroll  */}
      <div className='h-full '>
        {/* Search Window */}
        <div className='flex items-center'>
          <input className="bg-gray-200 h-12 w-10/12 m-3 p-3 rounded-md" placeholder='Search messages'/>
          <AiOutlineSearch size="28" className="h-10 w-10 opacity-30 mr-5 inline shrink-0 hover:cursor-pointer hover:text-sky-500"/>
        </div>
        {/* Conversation Card List */}
        <div className='h-full'>
          <ConversationCard />
          <ConversationCard />
          <ConversationCard />
          <ConversationCard />
          <ConversationCard />
          <ConversationCard />
        </div>
      </div>
    </div>
  )
}

function ConversationCard () {
  return (
    <div className='h-20 w-full p-4 hover:shadow-lg rounded-lg hover:bg-sky-100 hover:cursor-pointer flex'>
      <div className="shrink-0">
        <img className="h-12 w-12 rounded-md p-0.5" src="https://avatars.githubusercontent.com/u/33996345?v=4" alt="ChitChat Logo" />
      </div>
      <div className='pl-2 w-48'>
        <div className="text-xl font-medium text-black w-full overflow-hidden">ChitChat</div>
        <p className="text-slate-500 truncate">You have a new message!asdfasdfasdf</p>
      </div>
    </div>
  )
}
