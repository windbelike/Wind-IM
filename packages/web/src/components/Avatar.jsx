import BoringAvt from 'boring-avatars'

// classic Avatar
export default function Avatar ({ username }) {
  // BoringAvatar头像
  const colors = ['#FFD3B5', '#DCEDC2', '#FFD3B5', '#FFAAA6', '#FF8C94']
  return (
    <div className='shrink-0'>
      <BoringAvt size={40} variant="beam" name={username} />
    </div>
  )
}

// Deprecated 首字符圆头像
export function CircleAvatar (username) {
  const colorMap = {
    0: 'orange',
    1: 'cyan',
    2: 'green',
    3: 'red',
    4: 'gray',
    5: 'amber',
    6: 'yellow',
    7: 'lime',
    8: 'teal',
    9: 'indigo'
  }
  let chosenColor = 9
  if (username) {
    const firstCharCode = username.charCodeAt(0)
    chosenColor = firstCharCode % 10
  }
  const colorStr = `bg-${colorMap[chosenColor]}-500`
  return (
    <>
      <div className={ colorStr + ' rounded-full w-[50px] h-[50px] flex items-center justify-center text-white text-2xl  shrink-0'}>
        <p>{username.charAt(0).toUpperCase()}</p>
      </div>
      {/* 防止tailwindcss build后删除了无用的class */}
      <div className="bg-orange-500"></div>
      <div className="bg-green-500"></div>
      <div className="bg-red-500"></div>
      <div className="bg-gray-500"></div>
      <div className="bg-amber-500"></div>
      <div className="bg-yellow-500"></div>
      <div className="bg-lime-500"></div>
      <div className="bg-teal-500"></div>
      <div className="bg-teal-500"></div>
      <div className="bg-indigo-500"></div>
    </>
  )
}
