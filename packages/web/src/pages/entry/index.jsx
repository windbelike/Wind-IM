import { useState, useRef } from 'react'
import { getUserFromReq } from '../../utils/server-utils'
import LoginForm from './login'
import SignUpForm from './signup'

export default function Entry () {
  const [loginSwitch, setLoginSiwtch] = useState(true) // 默认登录界面
  return (
    <>
      <button onClick={() => setLoginSiwtch(!loginSwitch)}
        className='h-12 bg-black text-white m-5 px-5 shrink-0 '>
        {loginSwitch && 'SignUp'}
        {!loginSwitch && 'Login'}
      </button>
      {loginSwitch && <LoginForm/>}
      {!loginSwitch && <SignUpForm/>}
    </>
  )
}

// 为_app判断渲染条件使用
Entry.isEntry = true

// if logined already, jump to profile.
export async function getServerSideProps (ctx) {
  const user = await getUserFromReq(ctx.req)
  if (user) {
    return {
      redirect: {
        permanent: false,
        destination: '/user/profile'
      }
    }
  }
  return {
    props: {}
  }
}
