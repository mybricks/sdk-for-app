// @ts-ignore
import { getAxiosInstance } from '../util'

export default function uploadFlowContainer(params: { projectId: number, codeStrList: { fileId: number, fileName: string, content: string}[], envType: 'staging' | 'prod' }) {
  return new Promise((resolve, reject) => {
    getAxiosInstance()
    .post('/paas/api/flow/file/batchCreate', params)
    .then(({ data }: any) => {
      if (data.code === 1 && data.data) {
        resolve(data.data)
      } else {
        reject('上传失败')
      }
    })
  })
}
