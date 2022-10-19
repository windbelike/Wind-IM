import { Realtime, TextMessage, Event } from 'leancloud-realtime/es-latest'
import { useEffect, useState } from 'react'
import envConfig from '../envConfig'
import Link from 'next/link'
import utilStyles from '../styles/utils.module.css'

let realtime = null
const defaultUserName = 'Anonymous'
let client = null // IM client

// Legacy Component
// Conversation component
export default function Conv ({ username }) {
  const [msg, setMsg] = useState('')
  const [remoteUsername, setRemoteUsername] = useState(null)
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
      <h1>Hello, {username || defaultUserName}</h1>
      <div>
        {/* Msg sending */}
        {conversation
          ? <div>
            <label>
              Msg:
              <textarea value={msg} onChange={(e) => setMsg(e.target.value)} />
            </label>
            <input type="submit" value={'Send to ' + remoteUsername} onClick={() => sendMsg(conversation, msg)}/>
          </div>
          : <div> {/* Set remote username */}
            <label htmlFor="remoteUsernameInput">Remote: </label>
            <input id="remoteUsernameInput" type="text" name="text" onChange={(e) => setRemoteUsername(e.target.value)}/>
          </div>}
      </div>
    </div>

  )
}

async function loginImAndCreateConversation (clientId, remoteClientId, setConversation) {
  if (clientId == null || remoteClientId == null) {
    console.log('loginImAndCreateConversation params error')
    return
  }
  if (realtime == null) {
    realtime = new Realtime({
      appId: envConfig.appId,
      appKey: envConfig.appKey
    })
  }

  client = await realtime
    .createIMClient(clientId)
    .then(function (cli) {
      console.log(clientId + ' logined')
      return cli
    })
    .catch(console.error)

  // Create a conversation
  const conversation = await client.createConversation({
    // Declare the participant
    members: [remoteClientId],
    // Set conversasion name
    name: clientId + ' & ' + remoteClientId,
    // Make the conversasion unique
    unique: true
  })
  console.log(conversation)
  setConversation(conversation)

  // Bind clint for handling conversation events
  client.on(Event.INVITED, function invitedEventHandler (payload, conversation) {
    console.log(payload.invitedBy, conversation.id)
  })
  client.on(Event.MESSAGE, function (message, conversation) {
    console.log('Got new msg:' + message.text)
  })
}

function sendMsg (conversation, msg) {
  console.log('Sending msg: ' + msg)

  // Make a new conversation with remote
  if (conversation == null) {
    console.log('Invalid conversasion')
    return
  }
  conversation.send(new TextMessage(msg))
    .then(function (message) {
      console.log('Msg was sent successfully.')
    })
}
