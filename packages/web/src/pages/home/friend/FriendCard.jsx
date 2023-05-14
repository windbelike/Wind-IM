import Avatar from '@/components/Avatar'
import axios from '@/utils/axiosUtils'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { AiOutlineMessage, AiOutlineUserDelete } from 'react-icons/ai'
import { useMutation } from 'react-query'

async function createPrivateMsg ({ usernameAndTag }) {
  const result = await axios.post('/api/msg/privateMsg', { usernameAndTag })
  return result.data
}

export default function FriendCard ({ usernameAndTag, online = false }) {
  const createPrivateMsgMut = useMutation(createPrivateMsg)
  const router = useRouter()

  function onClickCreatePrivateMsg () {
    createPrivateMsgMut.mutate({ usernameAndTag })
  }

  if (createPrivateMsgMut.data) {
    const privateMsgId = createPrivateMsgMut.data.data?.id
    console.log(createPrivateMsgMut.data)
    if (privateMsgId) {
      router.push(`/home/directMessage/${privateMsgId}`)
    }
  }
  return (
    <div className='flex flex-col h-32 w-72 m-3 p-4 bg-[#36383e] rounded-3xl'>
      <div className='flex items-center'>
        <div className='flex items-end'>
          <Avatar username={usernameAndTag.split(/#/)[0]} />
          {online
            ? <div className='w-2 h-2 rounded-2xl bg-green-400'></div>
            : <div className='w-2 h-2 rounded-2xl bg-gray-300'></div>}
        </div>
        <div><p className='ml-3 text-[#e6eaf0]'>{usernameAndTag}</p></div>
      </div>

      <div className='flex gap-2 ml-auto mt-auto text-[#7b8086] '>
        <AiOutlineMessage onClick={onClickCreatePrivateMsg} className='hover:cursor-pointer' size="24"/>
        {/* Unsupported */}
        {/* <AiOutlineUserDelete className='hover:cursor-pointer' size="24"/> */}
      </div>
    </div>
  )
}
