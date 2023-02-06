import {isEnvOfDev, isEnvOfDevAndBrowser} from "../../env";

/**
 * 获取文件内容
 * @param fileId 文件id
 */
const getContent = (fileId: string) => {
  if (isEnvOfDevAndBrowser()) {//浏览器开发环境
    return forDevBrowser(fileId)
  }
}

export default getContent

const forDevBrowser = (fileId: string) => {
  console.log(fileId)
  return new Promise<string>((resolve, reject) => {
    let pageContent = window.localStorage.getItem('--mybricks--')
    if (pageContent) {
      pageContent = JSON.parse(pageContent)
      resolve(pageContent)
    } else {
      resolve(null)
    }
  })
}