import ChannelAvatar from '@/components/ChannelAvatar'
import { useRef, useState } from 'react'
import axios from '@/utils/axiosUtils'
import { useMutation, useQuery } from 'react-query'

async function createChannel ({ name, desc }) {
  const result = await axios.post('/api/channel', {
    name,
    desc
  })
  return result.data
}

async function getWhoami () {
  const result = await axios.get('/api/whoami')
  return result.data
}

export default function AddAChannelBg ({ id, onClickCloseAddAServer }) {
  const [nextPageFlag, setNextPageFlag] = useState(false)
  const createMyOwnElementId = 'createMyOwnElement'
  const joinAServerElementId = 'joinAServerElement'
  const [currentHit, setCurrentHit] = useState(createMyOwnElementId)
  const onNextPageClick = (e) => {
    console.log('onNextPageClick')
    if (e.target.id === createMyOwnElementId) {
      console.log('createMyOwnElementId')
      setCurrentHit(createMyOwnElementId)
    } else if (e.target.id === joinAServerElementId) {
      console.log('joinAServerElementId')
      setCurrentHit(joinAServerElementId)
    } else {
      console.error('invalid click')
    }
    setNextPageFlag(true)
  }
  const onLastPageClick = () => {
    console.log('onLastPageClick')
    setNextPageFlag(false)
  }

  function CreateMyOwn () {
    const { data, error, isLoading } = useQuery('whoami', getWhoami)
    const createChannelMut = useMutation(createChannel)
    const [channelName, setChannelName] = useState('')
    const avatarName = channelName + data?.data?.username

    function onClickCreate () {
      if (isChannelValid(channelName)) {
        createChannelMut.mutate({ name: channelName, desc: '' })
      } else {
        console.log('channelName is invalid')
      }
    }

    return (
      <div className="flex flex-col p-4 w-[440px] h-[436px]">
        <div>CreateMyOwn</div>
        {/* center div */}
        <div className='flex justify-center items-center mt-3 w-[408px] h-[87px]'>
          <ChannelAvatar name={avatarName} size={120} />
        </div>
        <div className='font-semibold text-xs mt-10 mb-2 mx-1'>NAME</div>
        <input type="text" className=" rounded-sm p-2 border-solid border-2 border-gray-200 focus:border-[#6bc001] bg-transparent" placeholder="Enter a channel name" onChange={(e) => setChannelName(e.target.value)}></input>
        <div className='overflow-hidden'>
          {createChannelMut.data?.code == 0 && (<div className='text-md m-1 text-green-500'>Channel created</div>)}

          {createChannelMut.error && (<div className='text-md m-1 text-red-500'>Channel create failed, {JSON.stringify(createChannelMut.error)}</div>)}

          {!isChannelValid(channelName) && (<div className='text-md m-1 text-red-500'>Channel name is invalid</div>)}
        </div>
        <div className="flex mt-auto ml-auto">
          <button onClick={onLastPageClick}>Back</button>
          <button className='m-2 rounded-lg w-[81px] h-[36px] bg-[#6bc001] text-white' onClick={onClickCreate}>Create</button>
        </div>
      </div>
    )
  }

  function JoinAServer () {
    return (
      <div className="flex flex-col p-4 w-[440px] h-[436px]">
        <div>JoinAServer</div>
        <div className="button2 mt-auto mr-auto  p-3" onClick={onLastPageClick}>
          <button>Back</button>
        </div>
      </div>
    )
  }

  return (
    <>
      <div onClick={onClickCloseAddAServer} id={id} className='fixed z-50 flex items-center justify-center bg-[rgba(0,0,0,0.5)] h-screen w-screen '>
        <div className={'bg-white rounded-lg duration-200 overflow-hidden ' + (nextPageFlag ? 'w-[440px] h-[436px]' : 'w-[440px] h-[330px]')}>
          {/* flipping page */}
          <div
            className="w-[880px] duration-200 flex flex-nowrap"
            style={{
              transform: nextPageFlag ? 'translateX(-440px)' : 'translateX(0)'
            }}
          >
            {/* first page */}
            <div className=" flex flex-col items-center w-[440px] h-[330px]">
              {/* Header */}
              <div className='text-xl text-center font-bold w-[408px] h-[87px]'>
                <p className='mt-10'>Wanna add a channel ?</p>
              </div>
              <button id={createMyOwnElementId} className="hover:bg-gray-100 font-bold my-3 w-[406px] h-[64px] text-center rounded-3xl border-gray-300 border-[1px] " onClick={onNextPageClick}>
              Create My Own
              </button>
              <button id={joinAServerElementId} className="hover:bg-gray-100 font-bold my-3 w-[406px] h-[64px] text-center rounded-3xl border-gray-300 border-[1px] " onClick={onNextPageClick}>
              Join A Server
              </button>
            </div>
            {/* second page */}
            {/* create my own Or join a server */}
            { currentHit === createMyOwnElementId && <CreateMyOwn />}
            { currentHit === joinAServerElementId && <JoinAServer />}
          </div>
        </div>
      </div>
    </>
  )
}

function isChannelValid (channelName) {
  if (!channelName || channelName.trim().length === 0) {
    return false
  }
  return channelName.length < 10
}
