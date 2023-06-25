import { getAxiosInstance } from '../util'

const getFileRoot = (params: any) => {
  return new Promise((resolve, reject) => {
    getAxiosInstance()
    .get('/paas/api/file/getFileRoot', {
      params
    })
    .then(({ data }: any) => {
      if (data.code === 1 && data.data) {
        resolve(data.data)
      } else {
        reject('获取文件根目录失败')
      }
    }).catch((e: any) => {
      reject(e.msg || '获取文件root失败')
    })
  })
}

export default getFileRoot