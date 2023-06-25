import { getAxiosInstance } from '../util'

export default (params: any) => {
  return new Promise((resolve, reject) => {
    getAxiosInstance()
    .get('/paas/api/file/getFileTreeMapByFile', {
      params
    })
    .then(({ data }: any) => {
      if (data.code === 1 && data.data) {
        resolve(data.data)
      } else {
        reject('获取文件树失败')
      }
    }).catch((e: any) => {
      reject(e.msg || '获取文件树失败')
    })
  })
}