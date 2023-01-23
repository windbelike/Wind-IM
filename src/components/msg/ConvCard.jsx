
export default function ConversationCard () {
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
