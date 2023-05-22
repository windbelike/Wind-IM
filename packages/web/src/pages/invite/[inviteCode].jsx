import { useRouter } from 'next/router'

export default function InviteLanding () {
  const router = useRouter()
  const inviteCode = router.query.inviteCode
  return (
    <div>
      <h1>InviteLanding, {inviteCode}</h1>
    </div>
  )
}
