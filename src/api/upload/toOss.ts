// @ts-ignore
import { getAxiosInstance } from '../util'
import {isEnvOfGlobalEmit, isEnvOfServer} from '../env'

/**
 * 上传文件到oss，如果平台未配置私有化oss地址，则上传到本地磁盘
 *
 * @param param {{
 *  content: string,        文件内容
 *  folderPath: string,     文件相对路径
 *  fileName: string,       文件名
 *  noHash?: boolean        文件名是否不需要hash
 *  }}
 * @returns
 */
function toOss(param: { content: string, folderPath: string, fileName: string, noHash?: boolean }) {
  const {content, folderPath, fileName, noHash} = param
  let blob;
  let formData: any;
  if(isEnvOfServer()) {
    if (isEnvOfGlobalEmit()) {
      formData = {
        folderPath,
        file: {
          buffer: Buffer.from(content),
          originalname: fileName,
        },
        noHash,
      };
    } else {
      // @ts-ignore
      blob = new Buffer.from(content)
      const FormData = require('form-data')
      formData = new FormData();
      formData.append('file', blob, fileName)
      formData.append('folderPath', folderPath)
      noHash && formData.append('noHash', JSON.stringify(noHash))
    }
  } else {
    blob = new Blob([content])
    // fix 客户端调用会报错
    formData = new window.FormData()
    formData.append('file', blob, fileName)
    formData.append('folderPath', folderPath)
    noHash && formData.append('noHash', JSON.stringify(noHash))
  }

  return new Promise((resolve, reject) => {
    getAxiosInstance()
    .post('/paas/api/oss/uploadFile', formData)
    .then(({ data }: any) => {
      if (data.code === 1 && data.data) {
        resolve(data.data)
      } else {
        reject('上传失败')
      }
    })
  })
}

export default toOss