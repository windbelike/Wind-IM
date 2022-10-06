import SideBar from './SideBar'

export default function Layout ({ children, home }) {
  return (
    <div className="flex">
      {/* <h1>{home ? 'Wind-IM Home Page' : ''}</h1> */}
      <SideBar />
      <main className='w-screen h-screen bg-gray-300'>{children}</main>
    </div>
  )
}
