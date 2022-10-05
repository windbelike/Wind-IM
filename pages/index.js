import { Realtime, TextMessage, Event } from 'leancloud-realtime/es-latest'
import { useEffect, useState } from 'react'
import envConfig from '../envConfig'
import Layout from '../components/Layout'
import { useUserInfoEffect } from '../lib/util'
import Link from 'next/link'
import utilStyles from '../styles/utils.module.css'

let realtime = null
const defaultUserName = 'Anonymous'
const loginTitle = 'Login'

export default function Home () {
  const userName = useUserInfoEffect() // User logining
  const [msg, setMsg] = useState('')
  const [remoteUsername, setRemoteUsername] = useState(null)
  const [conversation, setConversation] = useState(null)
  // const [msgBox, setMsgBox] = useState([])

  return (
    <Layout home={true}>
      <h1>Hello, {userName || defaultUserName}</h1>
      <div>
        {/* Need to login */}
        <Link className={utilStyles.listItem} href='/user/login'>
          <a href="#">{loginTitle}</a>
        </Link>
        {/* Msg sending */}
        {conversation
          ? <div>
            <label htmlFor="msgInput">Msg: </label>
            <input id="msgInput" type="text" name="text" onChange={(e) => setMsg(e.target.value)}/>
            <input type="submit" value={'Send to ' + remoteUsername} onClick={() => sendMsg(conversation, msg)}/>
          </div>
          : <div> {/* Set remote username */}
            <label htmlFor="remoteUsernameInput">Remote: </label>
            <input id="remoteUsernameInput" type="text" name="text" onChange={(e) => setRemoteUsername(e.target.value)}/>
          </div>}
        {/* Conversation logining */}
        <input type="submit" value={'Join the IM as ' + userName} onClick={() => loginImAndCreateConversation(userName, remoteUsername, setConversation)}/>
        <br/>
        {/* Msg receiving */}
        {/* <h1>Msg Received</h1>
        {msgBox.map((msg, id) =>
          (<li key={id}>
            <p>{msg}</p>
          </li>)
        )} */}
      </div>
    </Layout>
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

  const client = await realtime
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
  console.log('conversation:')
  console.log(conversation)
  setConversation(conversation)

  // Bind clint for handling conversation events
  client.on(Event.INVITED, function invitedEventHandler (payload, conversation) {
    console.log(payload.invitedBy, conversation.id)
  })
  client.on(Event.MESSAGE, function (message, conversation) {
    console.log('Got new msg:' + message.text)
    // console.log(msgBox)
    // const msgBoxCopy = [...msgBox]
    // msgBoxCopy.push(message.text)
    // setMsgBox(msgBoxCopy)
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
