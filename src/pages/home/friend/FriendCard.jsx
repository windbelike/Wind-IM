import { AiOutlineMessage, AiOutlineUserDelete } from 'react-icons/ai'

export default function FriendCard ({ email }) {
  return (
    <div className='flex flex-col h-32 w-72 m-3 p-4 bg-[#36383e] rounded-3xl'>
      <div className='flex items-center'>
        <img className='w-12 h-12 bg-white rounded-full' src="https://avatars.githubusercontent.com/u/33996345?v=4" alt="" />
        <div><p className='ml-3 text-[#e6eaf0]'>{email}</p></div>
      </div>
      <div className='flex gap-2 ml-auto mt-auto text-[#7b8086] '>
        <AiOutlineMessage className='hover:cursor-pointer' size="24"/>
        <AiOutlineUserDelete className='hover:cursor-pointer' size="24"/>
      </div>
    </div>
  )
}
