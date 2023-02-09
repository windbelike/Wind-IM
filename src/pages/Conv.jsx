import { useEffect, useState } from 'react'

const defaultUserName = 'Anonymous'

// Legacy Component
// Conversation component
export default function Conv () {
  const [msg, setMsg] = useState('')
  const [conversation, setConversation] = useState(null)
  // Get all conversations
  // useEffect(() => {
  //   if (client != null) {
  //     const query = client.getQuery()
  //     query.find().then(function (conversations) {
  //       console.log(conversations)
  //     }).catch(console.error.bind(console))
  //   }
  // }, [])

  // const [msgBox, setMsgBox] = useState([])
  return (
    <div>
      <button className="border-2 border-purple-500 hover:border-gray-500 ...">
  Button
      </button>
      <h1>Hello, </h1>
      <div>
        {/* Msg sending */}
        {conversation
          ? <div>
            <label>
              Msg:
              <textarea value={msg} onChange={(e) => setMsg(e.target.value)} />
            </label>
            <input type="submit" value={'Send to '} onClick={() => sendMsg(conversation, msg)}/>
          </div>
          : <div> {/* Set remote username */}
            <label htmlFor="remoteUsernameInput">Remote: </label>
            <input id="remoteUsernameInput" type="text" name="text" />
          </div>}
      </div>
    </div>

  )
}

async function loginImAndCreateConversation (clientId, remoteClientId, setConversation) {
}

function sendMsg (conversation, msg) {
}
