import { getAxiosInstance } from '../util'

/** 根据namespace查询下一个版本 */
const getNextVersionByNamespace = (namespace: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    getAxiosInstance()
      .get('/api/material/getNextVersionByNamespace', { params: { namespace } })
      .then(({ data }: { data?: { code: number, data: { version: string }, message: string} }) => {
        if (data) {
          if (data.code === 1) {
            resolve(data.data.version)
          } else {
            reject(`[根据namespace查询下一个版本] 错误: ${data.message}`)
          }
        } else {
          reject('[根据namespace查询下一个版本] 错误: 返回data为null')
        }
      })
      .catch((err: any) => {
        reject(`[根据namespace查询下一个版本] 错误: ${err}`)
      })
  })
}

export default getNextVersionByNamespace;