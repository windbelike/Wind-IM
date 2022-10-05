
export default function Layout ({ children, home }) {
  return (
    <div>
      <h1>{home ? 'Wind-IM Home Page' : ''}</h1>
      <main>{children}</main>
    </div>
  )
}
