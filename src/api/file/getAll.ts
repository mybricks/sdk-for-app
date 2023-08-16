import { getAxiosInstance } from '../util'

/**
 * 获取文件列表
 *
 * @param params {
 *  userId: string,                   邮箱或邮箱前缀
 *  parentId?: any,                   所属文件夹ID
 *  groupId?: string                  所属协作组ID
 * }
 * @returns {(Promise<{
 *   id: string,                      文件ID
 *   groupId: number | null,          所属自作组ID
 *   parentId: number | null,         所属文件夹ID
 *   name: string,                    文件名
 *   extName: string,                 文件类型
 *   creatorId: string,               创建人ID
 *   creatorName: string,             创建人名
 *   createTime: string,              创建时间
 *   updateTime: string,              更新时间
 * }[]>)}
 */
function getAll(params: { parentId?: any, userId?: string, groupId?: string }): Promise<{
  id: string,
  groupId: number | null,
  parentId: number | null,
  name: string,
  extName: string,
  creatorId: string,
  creatorName: string,
  createTime: string,
  updateTime: string,
}[]> {
  return new Promise((resolve, reject) => {
    const { parentId, userId, groupId } = params || {}
    getAxiosInstance().get('/paas/api/workspace/getAll',{
      params: {
        userId,
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