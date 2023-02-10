
// todo 添加动效
export default function AddFriendWindow ({ openAddFriendWindow, setOpenAddFriendWindow }) {
  const bgElementId = 'addFriendWindow'
  function onClickCloseWindow (e) {
    if (e.target.id === bgElementId) {
      setOpenAddFriendWindow(false)
    }
  }
  if (!openAddFriendWindow) {
    console.log(openAddFriendWindow)
    return <></>
  }

  return (
    <div id={bgElementId} className='fixed flex items-center z-20 w-full h-full left-0 top-0 bg-[rgba(0,0,0,0.5)]' onClick={onClickCloseWindow}>
      <div className="mx-auto w-[440px] h-[231px] bg-[#25262a] rounded-2xl p-5 ">
        <h1 className="text-white text-xl font-bold">添加好友</h1>
        <p className="text-[#717579] mt-2">需要用户邮箱</p>
        {/* <input type="text" className="w-48" placeholder="请输入邮箱" value=""></input> */}
      </div>
    </div>
  )
}
