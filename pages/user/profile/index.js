import { useUserInfoEffect } from '../../../lib/userInfoUtil.js'

export default function Profile () {
  const userName = useUserInfoEffect()

  return (
    <div>
      <h1>Hello, {userName}</h1>
    </div>
  )
}
