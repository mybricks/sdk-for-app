import { getAxiosInstance } from '../util'

/**
 * 查询保存记录
 *
 * @param {{ fileId: number, pageIndex: number, pageSize: number }} params
 * @returns {Promise<{ code: number, data: any[], total: number }>}
 */
function getSaveVersions(params: { fileId: number, pageIndex: number, pageSize: number }): Promise<{ code: number, data: any[], total: number }> {
  return new  Promise((resolve, reject) => {
    const { fileId, pageIndex = 1, pageSize = 100 } = params ?? {}
    getAxiosInstance()
    .get('/paas/api/workspace/save/versions', {
      params: {
        fileId,
        pageIndex,
        pageSize
      }
    }).then(({ data }: any) => {
      if (data) {
        resolve(data)
      } else {
        reject('查询保存记录失败')
      }
    }).catch((e: any) => {
      reject(e.msg || '查询保存记录失败')
    })
  })
}
export default getSaveVersions