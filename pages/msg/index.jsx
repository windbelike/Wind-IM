import { AiOutlinePlusCircle, AiOutlineDown, AiOutlineSearch } from 'react-icons/ai'

export default function Msg () {
  return (
    <div className="flex h-full overflow-hidden">
      <div className="w-1/3 h-full bg-white">
        {/* Head */}
        <div className="border-t-0 border-b-2 border-b-gray-300 border-solid h-24 flex items-center justify-between">
          <div className='w-48 flex items-center'>
            <p className="pl-5 ">Messages</p>
            <AiOutlineDown size="20" className="pr-5 h-9 w-9"/>
          </div>
          <AiOutlinePlusCircle className="pr-5 h-12 w-12 shrink-0"/>
        </div>
        {/* Conversation SideBar */}
        <div className='h-full overflow-scroll'>
          {/* Search Window */}
          <div className='flex items-center mt-5'>
            <input className="bg-gray-200 h-12 w-10/12 ml-5 pl-3 rounded-md" placeholder='Search messages'/>
            <AiOutlineSearch size="28" className="h-10 w-10 opacity-30 mr-5 inline shrink-0 hover:cursor-pointer hover:text-sky-500"/>
          </div>
          {/* Conversation List */}
          <div className='h-20 w-full bg-sky-500'></div>
          <div className='h-20 w-full bg-sky-500'></div><div className='h-20 w-full bg-sky-500'></div><div className='h-20 w-full bg-sky-500'></div><div className='h-20 w-full bg-sky-500'></div><div className='h-20 w-full bg-sky-500'></div><div className='h-20 w-full bg-sky-500'></div><div className='h-20 w-full bg-sky-500'></div><div className='h-20 w-full bg-sky-500'></div><div className='h-20 w-full bg-sky-500'></div><div className='h-20 w-full bg-sky-500'></div><div className='h-20 w-full bg-sky-500'></div><div className='h-20 w-full bg-sky-500'></div><div className='h-20 w-full bg-sky-500'></div>
        </div>
      </div>
      {/* Conversation Window */}
      <div className="w-2/3 h-full bg-sky-300">

      </div>
    </div>
  )
}
