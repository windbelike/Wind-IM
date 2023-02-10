
export default function AddFriendButton ({ openAddFriend, setOpenAddFriend }) {
  return (
    <button className='ml-5 rounded-md bg-[#6bc001] text-white px-2' onClick={() => setOpenAddFriend(true)}>添加好友</button>
  )
}
