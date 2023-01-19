import { useEffect } from 'react'

export default function Profile ({ username, data }) {
  console.log('serversideProps' + data)
  useEffect(() => {
    console.log('Profile effect')
  }, [])
  return (
    <div>
      <h1>Hello, {username}</h1>
    </div>
  )
}

// This gets called on every request
export async function getServerSideProps () {
  // Fetch data from external API
  const data = Math.random()
  // Pass data to the page via props
  return { props: { data } }
}
