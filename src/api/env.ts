
export function isEnvOfDev() {
  // @ts-ignore
  return typeof ENV !== 'undefined' && ENV === 'DEV'
}

export function isEnvOfBrowser() {
  return typeof MutationObserver !== 'undefined'
}

export function isEnvOfServer() {
  return typeof MutationObserver === 'undefined'
}

/** 应用间交互是否走函数直接调用，不走 http 请求 */
export function isEnvOfGlobalEmit() {
  return typeof global !== 'undefined' && typeof (global as any).emitGlobalEvent !== 'undefined';
}

/** 是否处于调试组件库模式 */
export function isDebugComlibMode() {
  if (!isEnvOfBrowser()) { /** 只有浏览器环境下才可用 */
    return false
  }

  return new URL(window?.location?.href)?.searchParams?.get?.('bricks_debug_server')
}

export function isEnvOfDevAndBrowser() {
  // /** 组件库调试模式走mock */
  if (isDebugComlibMode()) {
    return true
  }

  return isEnvOfDev() && isEnvOfBrowser()
}