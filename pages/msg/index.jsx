import { AiOutlinePlusCircle, AiOutlineDown, AiOutlineSearch } from 'react-icons/ai'

export default function Msg () {
  return (
    <div className="flex h-full overflow-hidden">
      <div className="w-72 h-full bg-white shrink-0">
        {/* Head */}
        <div className="border-t-0 border-b-2 border-b-gray-300 border-solid h-24 flex items-center justify-between">
          <div className='w-48 flex items-center'>
            <p className="pl-5 ">Messages</p>
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
            {/* Conversation Card */}
            <div className='h-20 w-64 p-4 mx-auto hover:shadow-lg rounded-lg bg-sky-100 hover:cursor-pointer flex'>
              <div className="shrink-0">
                <img className="h-12 w-12 rounded-md p-0.5" src="https://avatars.githubusercontent.com/u/33996345?v=4" alt="ChitChat Logo" />
              </div>
              <div>
                <div className="text-xl font-medium text-black w-full overflow-hidden">ChitChat</div>
                <p className="text-slate-500">You have a new message!</p>
              </div>
            </div>
            <div className='h-20 w-64 mx-auto rounded-lg hover:bg-sky-100 hover:cursor-pointer'></div>
          </div>
        </div>
      </div>
      {/* Conversation Window */}
      <div className="w-full h-full bg-sky-300">

      </div>
    </div>
  )
}
