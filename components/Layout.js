import SideBar from './SideBar'

export default function Layout ({ children, home }) {
  return (
    <div className="flex">
      <SideBar />
      <main className='w-screen h-screen bg-gray-300'>{children}</main>
    </div>
  )
}
