import { getAxiosInstance } from '../util'

/**
 * 查询发布版本
 *
 * @param {({
 *   fileId: number | string,
 *   pageIndex?: number,
 *   pageSize?: number,
 *   type?: string
 * })} params
 * @returns {Promise<{ code: number, data: any[], total: number }>}
 */
function getPublishVersions(params: {
  fileId: number | string,
  pageIndex?: number,
  pageSize?: number,
  type?: string
}): Promise<{ code: number, data: any[], total: number }> {
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
        resolve(data)
      } else {
        reject('查询发布版本失败')
      }
    }).catch((e: any) => {
      reject(e.msg || '查询发布版本失败')
    })
  })
}
export default getPublishVersions