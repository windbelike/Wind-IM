
export default function AddFriendButton ({ setOpenAddFriendWindow }) {
  return (
    <button className='ml-5 rounded-md bg-[#6bc001] text-white px-2' onClick={() => setOpenAddFriendWindow(true)}>Add Friend</button>
  )
}
