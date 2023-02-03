import {isEnvOfDev, isEnvOfDevAndBrowser} from "../../env";

interface Fn {
  (fileId: string): Promise<string>
}

/**
 * 获取文件内容
 * @param fileId 文件id
 */
const getContent: Fn = function (fileId: string) {
  if (isEnvOfDevAndBrowser()) {//浏览器开发环境
    return forDevBrowser(fileId)
  }
}

export default getContent

//------------------------------------------------------------------

const forDevBrowser: Fn = function (fileId: string) {
  console.log(fileId)


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