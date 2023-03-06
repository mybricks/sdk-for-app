import { getAxiosInstance } from '../util'

const getAll = (params?: { parentId?: any, email?: string }): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const { parentId, email } = params || {}
    getAxiosInstance().get('/paas/api/workspace/getAll',{
      userId: email,
      parentId,
    }).then(({ data }) => {
      if (data?.data) {
        resolve(data?.data || [])
      } else {
        reject('查询文件失败')
      }
    })
  })
}

export default getAll