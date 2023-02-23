import LoginForm from './login'

export default function Entry () {
  return (
    <LoginForm/>
  )
}

// 为_app判断渲染条件使用
Entry.isEntry = true
