import { AiOutlinePlusCircle, AiOutlineDown, AiOutlineSearch, AiOutlineClose } from 'react-icons/ai'
import ConversationCard from './ConvCard'

export default function ConversationSideBar ({ setVisiable }) {
  return (
    <div className="w-72 h-full bg-white shrink-0 flex flex-col">
      {/* Head */}
      <div className="border-t-0 border-b-2 border-solid h-18 flex items-center justify-between">
        <div className='w-48 flex items-center'>
          <p className="pl-5 text-xl font-medium ">Messages</p>
          <AiOutlineDown size="20" className="pr-5 h-9 w-9"/>
        </div>
        <div className='hover:cursor-pointer hover:text-sky-300' onClick={() => setVisiable(true)}>
          <AiOutlinePlusCircle className="pr-5 h-12 w-12 shrink-0"/>
        </div>
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
