import {isEnvOfDev, isEnvOfDevAndBrowser} from "../env";

interface Fn {
  (): Promise<string>
}

/**
 * 获取当前文件内容
 */
const getFileContent: Fn = function () {
  if (isEnvOfDevAndBrowser()) {//浏览器开发环境
    return forDevBrowser()
  }
}

export default getFileContent

//------------------------------------------------------------------

const forDevBrowser: Fn = function () {
  return new Promise<string>((resolve, reject) => {
    let pageContent = window.localStorage.getItem('--mybricks--')
    if (pageContent) {
      pageContent = JSON.parse(pageContent)

      resolve(pageContent)
    } else {
      // resolve(null)
      // return
      // import('./demo-data.json').then(data => {
      //   pageContent = JSON.parse(JSON.stringify(data))
      //   resolve(pageContent)
      // })

      resolve(null)
    }
  })
}