import {isEnvOfDev, isEnvOfDevAndBrowser} from "../../env";

/**
 * 保存文件
 * @param fileId 文件id
 * @param content 文件内容
 */

interface Fn {
  (fileId: string, opts: { content: string }): Promise<boolean>
}

const save: Fn = function (fileId: string, opts) {
  if (isEnvOfDevAndBrowser()) {//浏览器开发环境
    return forDevBrowser(fileId, opts)
  }
}

export default save

//----------------------------------------------------------------------------------

const forDevBrowser: Fn = function (fileId: string, opts) {
  return new Promise<boolean>((resolve, reject) => {
    window.localStorage.setItem('--mybricks--', JSON.stringify(opts.content))
    resolve(true)
  })
}
