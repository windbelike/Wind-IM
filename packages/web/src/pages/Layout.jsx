import SideBar from './SideBar'

export default function Layout ({ children, userInfoContext }) {
  return (
    <div className="flex">
      <SideBar userInfoContext={userInfoContext}/>
      <main className='w-screen h-screen'>{children}</main>
    </div>
  )
}
