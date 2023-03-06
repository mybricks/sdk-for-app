import { getAxiosInstance } from '../util'
import { isEnvOfServer } from '../../env'

export default function staticServer({content, folderPath, fileName}) {
  let blob;
  let formData;
  if(isEnvOfServer()) {
    blob = Buffer.from([content])
    const FormData = require('form-data')
    formData = new FormData()
  } else {
    blob = new Blob([content])
    formData = new FormData()
  }
  formData.append('file', blob, fileName)
  formData.append('folderPath', folderPath)

  return new Promise((resolve, reject) => {
    getAxiosInstance()
    .post('/paas/api/flow/saveFile', formData)
    .then(({ data }) => {
      if (data.code === 1 && data.data) {
        resolve(data.data)
      } else {
        reject('上传失败')
      }
    })
  })
}
