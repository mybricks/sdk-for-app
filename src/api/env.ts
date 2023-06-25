
export function isEnvOfDev() {
  // @ts-ignore
  return typeof ENV !== 'undefined' && ENV === 'DEV'
}

export function isEnvOfBrowser() {
  return typeof window !== 'undefined'
}

export function isEnvOfServer() {
  return typeof process !== 'undefined'
}

/** 是否处于调试组件库模式 */
// export function isDebugComlibMode() {
//   if (!window?.location || !window?.URL) {
//     return false
//   }
//   return new URL(window.location?.href)?.searchParams?.get?.('bricks_debug_server')
// }

export function isEnvOfDevAndBrowser() {
  // /** 组件库调试模式走mock */
  // if (isDebugComlibMode()) {
  //   return true
  // }

  return isEnvOfDev() && isEnvOfBrowser()
}