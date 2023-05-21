
function buildPrivateMsgStoreKey (privateMsgId) {
  return 'privateMsg_' + privateMsgId
}

// use localStorage to cache direct messages
export function storeDirectMsg (privateMsgId, msg) {
  const storageKey = buildPrivateMsgStoreKey(privateMsgId)
  let currentMsgListStr = localStorage.getItem(storageKey)
  if (currentMsgListStr == null) {
    currentMsgListStr = '[]'
  }
  const msgArray = JSON.parse(currentMsgListStr)
  if (Array.isArray(msg)) {
    msgArray.push(...msg)
  } else {
    msgArray.push(msg)
  }

  const msgArrayStr = JSON.stringify(msgArray)
  localStorage.setItem(storageKey, msgArrayStr)
}

export function getDMfromLocalStorage (privateMsgId) {
  const storageKey = buildPrivateMsgStoreKey(privateMsgId)
  let currentMsgListStr = localStorage.getItem(storageKey)
  if (currentMsgListStr == null) {
    currentMsgListStr = '[]'
  }
  const msgArray = JSON.parse(currentMsgListStr)
  return msgArray
}

// get the latest offset of an DM
export function getLatestStoredDMOffset (privateMsgId) {
  const storageKey = buildPrivateMsgStoreKey(privateMsgId)
  const currentMsgListStr = localStorage.getItem(storageKey)
  if (currentMsgListStr == null) {
    return 0
  }
  const msgArray = JSON.parse(currentMsgListStr)
  const latestMsg = msgArray.pop()
  return latestMsg.id
}
