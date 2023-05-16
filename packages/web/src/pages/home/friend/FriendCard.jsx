import Avatar from '@/components/Avatar'
import axios from '@/utils/axiosUtils'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { AiOutlineMessage, AiOutlineUserDelete } from 'react-icons/ai'
import { useMutation } from 'react-query'

async function createPrivateMsg ({ usernameAndTag }) {
  const result = await axios.post('/api/msg/privateMsg', { usernameAndTag })
  return result.data
}

export default function FriendCard ({ usernameAndTag, online = false, sideBarActiveState }) {
  const createPrivateMsgMut = useMutation(createPrivateMsg)
  const router = useRouter()

  function onClickCreatePrivateMsg () {
    createPrivateMsgMut.mutate({ usernameAndTag })
  }

  useJump2DirectMsg(createPrivateMsgMut, sideBarActiveState, router)

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
function useJump2DirectMsg (createPrivateMsgMut, sideBarActiveState, router) {
  // use effect to avoid calling setState during render
  // or u will get an Warning: Cannot update a component from inside the function body of a different component.
  // see: https://pl.legacy.reactjs.org/blog/2020/02/26/react-v16.13.0.html
  useEffect(() => {
    if (createPrivateMsgMut.data) {
      const privateMsgId = createPrivateMsgMut.data.data?.id
      if (privateMsgId) {
        const to = `/home/directMessage/${privateMsgId}`
        const [activeState, setSideBarActiveState] = sideBarActiveState
        router.push(to)
        if (setSideBarActiveState != null) {
          setSideBarActiveState(to)
        }
      }
    }
  }, [createPrivateMsgMut.data])
}
