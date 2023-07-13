import { getAxiosInstance } from '../util'

interface Params {
  fileId: number | string
  pageIndex?: number
  pageSize?: number
  type?: string
}

const getPublishVersions = (params: Params): Promise<any[]> => {
  return new  Promise((resolve, reject) => {
    const { fileId, pageIndex = 1, pageSize = 100, type } = params ?? {}
    getAxiosInstance()
    .get('/paas/api/workspace/publish/versions', {
      params: {
        fileId,
        pageIndex,
        pageSize,
        type
      }
    }).then(({ data }: any) => {
      if (data?.data) {
        resolve(data?.data || [])
      } else {
        reject('查询文件失败')
      }
    }).catch((e: any) => {
      reject(e.msg || '查询版本信息失败')
    })
  })
}
export default getPublishVersions