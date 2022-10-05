import styles from '../styles/Home.module.css'
import { Realtime, TextMessage } from 'leancloud-realtime/es-latest'
import { useEffect, useState } from 'react'

let realtime = null
const needLogin = false
let client = null

async function login (clientID) {
  console.log('login')
  // Tom 用自己的名字作为 clientId 来登录即时通讯服务
  if (realtime == null) {
    realtime = new Realtime({
      appId: 'NtnS7AqCONxYANYnQZR7VymL-MdYXbMMI',
      appKey: 'Od9lqhZuSThU7AilwYrN4UH7'
    })
  }

  client = await realtime
    .createIMClient(clientID)
    .then(function (cli) {
      // 成功登录
      console.log(clientID + ' logined')
      return cli
    })
    .catch(console.error)
}

function sendMsg (msg) {
  if (client == null) {
    console.log('client has not logined.')
    return
  }
  console.log('sendMsg...')
  console.log(client)

  // 创建与 Jerry 之间的对话
  client.createConversation({ // tom 是一个 IMClient 实例
    // 指定对话的成员除了当前用户 Tom（SDK 会默认把当前用户当做对话成员）之外，还有 Jerry
    members: ['Jerry'],
    // 对话名称
    name: 'Tom & Jerry',
    unique: true
  }).then(conversation => {
    conversation.send(new TextMessage(msg)).then(function (message) {
      console.log('Tom & Jerry', '发送成功！')
    }).catch(console.error)
  })
}

export default function Home () {
  // Effect: 登录IM Client
  useLoginAndSendMsgEffect()
  const [clientID, setClientID] = useState('')
  const [msg, setMsg] = useState('')
  return (
    <div className={styles.container}>
      <h1>Wind-IM</h1>
      <div>
        {/* 登录输入框clientID */}
        <label htmlFor="loginInput">Name: </label>
        <input id="loginInput" type="text" name="text" onChange={(e) => setClientID(e.target.value)}/>
        <input type="submit" value='Login' onClick={() => login(clientID)}/>
        <br/>
        {/* 发消息输入框 */}
        <label htmlFor="msgInput">Msg: </label>
        <input id="msgInput" type="text" name="text" onChange={(e) => setMsg(e.target.value)}/>
        <input type="submit" value='Send' onClick={() => sendMsg(msg)}/>
      </div>
    </div>

  )
}

function useLoginAndSendMsgEffect () {
  useEffect(() => {
    if (!needLogin) {
      return
    }
    console.log('run effect')
    // Tom 用自己的名字作为 clientId 来登录即时通讯服务
    realtime
      .createIMClient('Tom')
      .then(function (tom) {
        // 成功登录
        console.log('Tom logined')
        // 创建与 Jerry 之间的对话
        tom.createConversation({ // tom 是一个 IMClient 实例
          // 指定对话的成员除了当前用户 Tom（SDK 会默认把当前用户当做对话成员）之外，还有 Jerry
          members: ['Jerry'],
          // 对话名称
          name: 'Tom & Jerry',
          unique: true
        }).then(conversation => {
          conversation.send(new TextMessage('Jerry，起床了！')).then(function (message) {
            console.log('Tom & Jerry', '发送成功！')
          }).catch(console.error)
        })
      })
      .catch(console.error)
  }, [])
}
