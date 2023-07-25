import { getAxiosInstance } from '../util'

const getLatestComponentLibrarys = async (namespaces: Array<string>) => {
  return new Promise((resolve, reject) => {
    getAxiosInstance()
    .get('/api/material/getLatestComponentLibrarys', {
      params: {
        namespaces
      }
    })
    .then(({ data }: any) => {
      if (data?.data) {
        resolve(data?.data || [])
      } else {
        reject('查询最新组件库信息失败')
      }
    }).catch((e: any) => {
      reject(e.msg || '查询最新组件库信息失败')
    });
  })
}

export default getLatestComponentLibrarys
