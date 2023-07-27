import { getAxiosInstance } from '../util'

const getHierarchy = (params: {
  fileId: number | string
}): Promise<{ projectId: any, hierarchy: any }> => {
  return new Promise((resolve, reject) => {
    const { fileId } = params ?? {}
    getAxiosInstance()
      .get(`/paas/api/file/getParentModuleAndProjectInfo?id=${fileId}`)
      .then(({ data }: any) => {
        resolve(data?.data || {})
      })
      .catch((e: any) => {
        reject(e.msg || '查询层级结构失败')
      })
  })
}
export default getHierarchy