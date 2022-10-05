import { useUserInfoEffect } from '../../../lib/util'

export default function Profile () {
  const userName = useUserInfoEffect()

  return (
    <div>
      <h1>Hello, {userName}</h1>
    </div>
  )
}
