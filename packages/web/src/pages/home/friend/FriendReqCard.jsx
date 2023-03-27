
import { statusPass, statusRefuse } from '@/utils/friendEnums'
import axios from '@/utils/axiosUtils'
import { AiOutlineUserAdd, AiOutlineCloseCircle, AiOutlineCheckCircle } from 'react-icons/ai'
import { useMutation } from 'react-query'

async function passFriendReq ({ reqId }) {
  const result = await axios.post('/api/friendRequest', {
    reqId,
    status: statusPass,
    opType: 1
  })
  return result.data
}

async function refuseFriendReq ({ reqId }) {
  const result = await axios.post('/api/friendRequest', {
    reqId,
    status: statusRefuse,
    opType: 1
  })
  return result.data
}

export default function FriendCard ({ friendReq }) {
  const passFriendReqMut = useMutation(passFriendReq)
  const refuseFriendReqMut = useMutation(refuseFriendReq)

  function onClickPass () {
    passFriendReqMut.mutate({ reqId: friendReq.id })
  }

  function onClickRefuse () {
    refuseFriendReqMut.mutate({ reqId: friendReq.id })
  }

  if (passFriendReqMut.data) {
    return <>{JSON.stringify(passFriendReqMut.data)}</>
  }

  if (passFriendReqMut.error) {
    return <>{JSON.stringify(passFriendReqMut.error)}</>
  }

  if (refuseFriendReqMut.data) {
    return <>{JSON.stringify(refuseFriendReqMut.data)}</>
  }

  if (refuseFriendReqMut.error) {
    return <>{JSON.stringify(refuseFriendReqMut.error)}</>
  }

  return (
    <div className='flex flex-col h-32 w-72 m-3 p-4 bg-[#36383e] rounded-3xl'>
      <div className='flex items-center'>
        <img className='w-12 h-12 bg-white rounded-full' src="https://avatars.githubusercontent.com/u/33996345?v=4" alt="" />
        <p className='ml-3 text-[#e6eaf0]'>{friendReq?.fromUidRel?.username}#{friendReq?.fromUidRel?.tag}</p>
      </div>
      <div className='flex gap-2 ml-auto mt-auto text-[#7b8086] '>
        <AiOutlineCheckCircle onClick={onClickPass} className='hover:cursor-pointer' size="24"/>
        <AiOutlineCloseCircle onClick={onClickRefuse} className='hover:cursor-pointer' size="24"/>
      </div>
    </div>
  )
}
