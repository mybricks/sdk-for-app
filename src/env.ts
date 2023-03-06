
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

export function isEnvOfDevAndBrowser() {
  return isEnvOfDev() && isEnvOfBrowser()
}