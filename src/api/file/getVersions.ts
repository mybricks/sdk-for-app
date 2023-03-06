import { getAxiosInstance } from '../util'

interface Params {
  fileId: number | string
  pageIndex?: number
  pageSize?: number
}

const getVersions = (params: Params): Promise<any[]> => {
  return new  Promise((resolve, reject) => {
    const { fileId, pageIndex = 1, pageSize = 100 } = params ?? {}
    getAxiosInstance()
    .get('/paas/api/workspace/publish/versions', {
      fileId,
      pageIndex,
      pageSize
    }).then(({ data }: any) => {
      if (data?.data) {
        resolve(data?.data || [])
      } else {
        reject('查询文件失败')
      }
    })
  })
}
export default getVersions