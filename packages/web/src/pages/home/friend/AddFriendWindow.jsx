import axios from 'axios'
import { useRef } from 'react'
import { useMutation } from 'react-query'

async function addFriend ({ email }) {
  const result = await axios.post('/api/friendRequest', {
    email,
    opType: 0,
    content: 'You have a new friend request.'
  })
  return result.data
}

// todo 添加动效
export default function AddFriendWindow ({ openAddFriendWindow, setOpenAddFriendWindow }) {
  const bgElementId = 'addFriendWindow'
  const cancelElementId = 'cancelButton'
  const addFriendMutation = useMutation(addFriend)
  const $email = useRef(null)

  function onClickCloseWindow (e) {
    if (e.target.id === bgElementId || e.target.id === cancelElementId) {
      setOpenAddFriendWindow(false)
    }
  }

  function onClickSubmit () {
    const email = $email.current.value
    console.log('onClickSubmit email, ' + email)
    addFriendMutation.mutate({ email })
    // setOpenAddFriendWindow(false)
  }

  console.log(JSON.stringify(addFriendMutation.data))

  if (!openAddFriendWindow) {
    console.log(openAddFriendWindow)
    return <></>
  }

  return (
    <div id={bgElementId} className='fixed flex items-center z-20 w-full h-full left-0 top-0 bg-[rgba(0,0,0,0.5)]' onClick={onClickCloseWindow}>
      <div className="mx-auto flex flex-col w-[440px] h-[231px] bg-[#25262a] rounded-2xl p-5 ">
        <h1 className="text-white text-xl font-bold">添加好友</h1>
        <p className="text-[#717579] mt-2">需要用户邮箱</p>
        <input type="text" className="m-4 text-white rounded-xl p-2 border-solid border-2 border-[#323437] focus:border-[#6bc001] bg-transparent" placeholder="请输入邮箱" ref={$email}></input>
        {addFriendMutation.error && <div className='ml-4 text-red-600'>{addFriendMutation.error.response.data.message}</div>}
        {addFriendMutation.data && <div className='ml-4 text-white'>{JSON.stringify(addFriendMutation.data)}</div>}
        <div className='flex ml-auto mt-auto gap-3 text-white'>
          <button id='cancelButton' className=''>取消</button>
          <button className='rounded-md bg-[#6bc001] p-1' onClick={onClickSubmit}>发送好友请求</button>
        </div>
      </div>
    </div>
  )
}
