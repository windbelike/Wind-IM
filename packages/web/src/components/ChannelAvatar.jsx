import BoringAvt from 'boring-avatars'

// classic Avatar
export default function ChannelAvatar ({ name, size = 40 }) {
  const colors = ['#CF0638', '#FA6632', '#FECD23', '#0A996F', '#0A6789']
  return (
    <div className='shrink-0'>
      <BoringAvt size={size} variant="bauhaus" name={name} colors={colors} />
    </div>
  )
}
