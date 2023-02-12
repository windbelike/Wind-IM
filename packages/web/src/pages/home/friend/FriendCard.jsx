import axios from 'axios'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { AiOutlineMessage, AiOutlineUserDelete } from 'react-icons/ai'
import { useMutation } from 'react-query'

async function createPrivateMsg ({ email }) {
  const result = await axios.post('/api/msg/privateMsg', { email })
  return result.data
}
export default function FriendCard ({ email }) {
  const createPrivateMsgMut = useMutation(createPrivateMsg)
  const router = useRouter()

  function onClickCreatePrivateMsg () {
    createPrivateMsgMut.mutate({ email })
  }

  if (createPrivateMsgMut.data) {
    const privateMsgId = createPrivateMsgMut.data.data?.id
    console.log(createPrivateMsgMut.data)
    if (privateMsgId) {
      router.push(`/home/inbox/${privateMsgId}`)
    }
  }
  return (
    <div className='flex flex-col h-32 w-72 m-3 p-4 bg-[#36383e] rounded-3xl'>
      <div className='flex items-center'>
        <img className='w-12 h-12 bg-white rounded-full' src="https://avatars.githubusercontent.com/u/33996345?v=4" alt="" />
        <div><p className='ml-3 text-[#e6eaf0]'>{email}</p></div>
      </div>
      <div className='flex gap-2 ml-auto mt-auto text-[#7b8086] '>
        <AiOutlineMessage onClick={onClickCreatePrivateMsg} className='hover:cursor-pointer' size="24"/>
        <AiOutlineUserDelete className='hover:cursor-pointer' size="24"/>
      </div>
    </div>
  )
}
