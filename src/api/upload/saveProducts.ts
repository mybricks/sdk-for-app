// @ts-ignore
import { getAxiosInstance } from '../util'
import { isEnvOfGlobalEmit, isEnvOfServer } from '../env'

/**
 * 保存每个版本的制品到存储中
 *
 * @param {{ content: any, fileId: number, type: string, version: string }} param
 * @returns
 */
function saveProducts(param: { content: any, fileId: number, type: string, version: string }) {
  const {content, fileId, type, version} = param
  let blob;
  let formData: any;
  if(isEnvOfServer()) {
    if (isEnvOfGlobalEmit()) {
      formData = { content, fileId, type, version };
    } else {
      blob = Buffer.from(content);
      const FormData = require('form-data');
      formData = new FormData();
      formData.append('file', blob, `${fileId}.zip`);
      formData.append('fileId', fileId);
      formData.append('type', type);
      formData.append('version', version);
    }
  } else {
    blob = new Blob([content])
    // fix 客户端调用会报错
    formData = new window.FormData()
    formData.append('file', blob, `${fileId}.zip`)
    formData.append('fileId', fileId)
    formData.append('type', type)
    formData.append('version', version)
  }

  return new Promise((resolve, reject) => {
    getAxiosInstance()
    .post('/paas/api/flow/saveProducts', formData)
    .then(({ data }: any) => {
      if (data.code === 1 && data.data) {
        resolve(data.data)
      } else {
        reject('上传失败')
      }
    })
  })
}

export default saveProducts
