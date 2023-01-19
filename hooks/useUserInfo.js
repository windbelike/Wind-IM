import envConfig from '../envConfig'
const AV = require('leancloud-storage')

let hasInitServerless = false
export function initServerless () {
  console.log('hasInitServerless:' + hasInitServerless)
  // 初始化Serverless配置
  if (hasInitServerless) {
    return
  }
  AV.init({
    appId: envConfig.appId,
    appKey: envConfig.appKey
  })
  hasInitServerless = true
}

export function useUserInfo (defaultUsername) {
  initServerless()
  const currentUser = AV.User.current()
  if (currentUser) {
    // Jump to welcome page.
    console.log(currentUser.getUsername() + ' has already logined')

    return currentUser.getUsername()
  } else {
    // Jump to login/register page.
    console.log('Not logined yet')

    return defaultUsername
  }
}
