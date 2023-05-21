
function buildPrivateMsgStoreKey (privateMsgId) {
  return 'privateMsg_' + privateMsgId
}

function buildRoomMsgStoreKey (roomId) {
  return 'roomMsg_' + roomId
}

// use localStorage to cache direct messages
export function storeDirectMsg (privateMsgId, msg) {
  const storageKey = buildPrivateMsgStoreKey(privateMsgId)
  storeMsgByKey(storageKey, msg)
}

// use localStorage to cache room messages
export function storeRoomMsg (roomId, msg) {
  const storageKey = buildRoomMsgStoreKey(roomId)
  storeMsgByKey(storageKey, msg)
}

function storeMsgByKey (storageKey, msg) {
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

// get Direct Mesages from localStorage
export function getDMfromLocalStorage (privateMsgId) {
  const storageKey = buildPrivateMsgStoreKey(privateMsgId)
  return getMsgByKey(storageKey)
}

// get Room Messages from localStorage
export function getRMFromLocalStorage (roomId) {
  const storageKey = buildRoomMsgStoreKey(roomId)
  return getMsgByKey(storageKey)
}

function getMsgByKey (storageKey) {
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
  return getLatestOffsetByKey(storageKey)
}

// get the latest offset of an RM
export function getLatestStoredRMOffset (roomId) {
  const storageKey = buildRoomMsgStoreKey(roomId)
  return getLatestOffsetByKey(storageKey)
}

function getLatestOffsetByKey (storageKey) {
  const currentMsgListStr = localStorage.getItem(storageKey)
  if (currentMsgListStr == null) {
    return 0
  }
  const msgArray = JSON.parse(currentMsgListStr)
  const latestMsg = msgArray.pop()
  return latestMsg.id
}
