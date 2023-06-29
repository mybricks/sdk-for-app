// @ts-ignore
import { getAxiosInstance } from '../util'
import { isEnvOfServer } from '../env'

export default function staticServer({content, folderPath, fileName, noHash = false}: any) {
  let blob;
  let formData: any;
  if(isEnvOfServer()) {
    // @ts-ignore
    blob = new Buffer.from(content)
    const FormData = require('form-data')
    formData = new FormData()
  } else {
    blob = new Blob([content])
    // fix 客户端调用会报错
    formData = new window.FormData()
  }
  formData.append('file', blob, fileName)
  formData.append('folderPath', folderPath)
  formData.append('noHash', noHash)

  return new Promise((resolve, reject) => {
    getAxiosInstance()
    .post('/paas/api/flow/saveFile', formData)
    .then(({ data }: any) => {
      if (data.code === 1 && data.data) {
        resolve(data.data)
      } else {
        reject('上传失败')
      }
    })
  })
}
