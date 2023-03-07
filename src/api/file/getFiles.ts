import { getAxiosInstance } from '../util'

const getAll = (params: any) => {
  return new Promise((resolve, reject) => {
    getAxiosInstance()
    .get('/paas/api/file/getFiles', {
      params
    })
    .then(({ data }: any) => {
      if (data.code === 1 && data.data) {
        resolve(data.data)
      } else {
        reject('获取文件列表失败')
      }
    })
  })
}

export default getAll