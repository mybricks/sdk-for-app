//当前文件ID

export const Env:{
  curFileId: string
} = {}

//----------------------------------------------------------------

export function isEnvOfDev() {
  // @ts-ignore
  return typeof ENV !== 'undefined' && ENV === 'DEV'
}

export function isEnvOfBrowser() {
  return window !== void 0
}

export function isEnvOfDevAndBrowser() {
  return isEnvOfDev() && isEnvOfBrowser()
}