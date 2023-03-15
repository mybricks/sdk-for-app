// @ts-ignore
import { getAxiosInstance } from '../util'

export default function uploadFlowContainer({ projectId, codeStrList }: { projectId: number, codeStrList: { fileId: number, fileName: string, content: string}[] }) {
  return new Promise((resolve, reject) => {
    getAxiosInstance()
    .post('/paas/api/flow/file/batchCreate', { projectId, codeStrList })
    .then(({ data }: any) => {
      if (data.code === 1 && data.data) {
        resolve(data.data)
      } else {
        reject('上传失败')
      }
    })
  })
}
