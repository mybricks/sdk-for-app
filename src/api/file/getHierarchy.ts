import { getAxiosInstance } from '../util'

/**
 * 获取文件层级结构
 *
 * @param {({
 *   fileId: number | string
 * })} params
 * @returns {Promise<{ projectId: any, hierarchy: any; groupId?: number }>}
 */
function getHierarchy(params: {
  fileId: number | string
}): Promise<{ projectId: any, hierarchy: any; groupId?: number }> {
  return new Promise((resolve, reject) => {
    const { fileId } = params ?? {}
    getAxiosInstance()
      .get('/paas/api/file/getParentModuleAndProjectInfo', { params: { id: fileId } })
      .then(({ data }: any) => {
        resolve(data?.data || {})
      })
      .catch((e: any) => {
        reject(e.msg || '查询层级结构失败')
      })
  })
}
export default getHierarchy