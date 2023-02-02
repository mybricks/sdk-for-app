import {isEnvOfDev, isEnvOfDevAndBrowser} from "../env";

/**
 * 保存文件
 * @param fileId 文件id
 * @param content 文件内容
 */

interface Fn {
  (opts: { content: string }): Promise<boolean>
}

const publishFile: Fn = function (opts) {
  if (isEnvOfDevAndBrowser()) {//浏览器开发环境
    return forDevBrowser(opts)
  }
}

export default publishFile

//----------------------------------------------------------------------------------

const forDevBrowser: Fn = function (opts) {
  return new Promise<boolean>((resolve, reject) => {
    window.localStorage.setItem('--mybricks--', JSON.stringify(opts.content))
    resolve(true)
  })
}
