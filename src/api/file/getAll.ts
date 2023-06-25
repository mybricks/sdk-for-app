import { getAxiosInstance } from '../util'

/**
 * 获取文件列表
 *
 * @param {{ parentId?: any, email?: string, groupId?: string }} [params]
 * @returns {Promise<any[]>}
 */
function getAll(params?: { parentId?: any, email?: string, groupId?: string }): Promise<any[]> {
  return new Promise((resolve, reject) => {
    const { parentId, email, groupId } = params || {}
    getAxiosInstance().get('/paas/api/workspace/getAll',{
      params: {
        userId: email,
        parentId,
        groupId
      }
    }).then(({ data }: any) => {
      if (data?.data) {
        resolve(data?.data || [])
      } else {
        reject('查询文件失败')
      }
    }).catch((e: any) => {
      reject(e.msg || '查询文件列表失败')
    })
  })
}

export default getAll