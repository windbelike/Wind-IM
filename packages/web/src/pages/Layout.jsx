import SideBar from './SideBar'

export default function Layout ({ children }) {
  return (
    <div className="flex bg-[#25272a]">
      <SideBar/>
      <main className='w-screen h-screen'>{children}</main>
    </div>
  )
}
