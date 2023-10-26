import { getAxiosInstance } from '../util'
import { isEnvOfServer } from '../env'

export default function staticServer(param: { content: any, folderPath: string, fileName: string, noHash?: any, domainName?: string }) {
  const {content, folderPath, fileName, noHash, domainName} = param
  let blob;
  let formData: any;
  if(isEnvOfServer()) {
    formData = {
      folderPath,
      file: {
        buffer: Buffer.from(content),
        originalname: fileName,
      },
      noHash,
      domainName,
    };
  } else {
    blob = new Blob([content])
    // fix 客户端调用会报错
    formData = new window.FormData()
    formData.append('file', blob, fileName)
    formData.append('folderPath', folderPath)
    noHash && formData.append('noHash', JSON.stringify(noHash))
    domainName && formData.append('domainName', domainName)
  }

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
