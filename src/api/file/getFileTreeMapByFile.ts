import { getAxiosInstance } from '../util'

export default (params): Promise<any> => {
  return new Promise((resolve, reject) => {
    getAxiosInstance()
    .get('/paas/api/file/getFileTreeMapByFile', params)
    .then(({ data }) => {
      if (data.code === 1 && data.data) {
        resolve(data.data)
      } else {
        reject('获取文件树失败')
      }
    })
  })
}