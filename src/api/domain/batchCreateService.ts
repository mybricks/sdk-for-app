import { getAxiosInstance } from '../util'

const batchCreateService = async (params: {fileId: number, serviceContentList: {id: string, code: string}[], projectId?: number}) => {
  return new Promise((resolve, reject) => {
    if(!params.fileId || !params.serviceContentList) {
      reject('请传入必要参数')
    }
    getAxiosInstance()
    .post('/paas/api/domain/service/batchCreate', params).then(({ data }: any) => {
      if (data.code === 1) {
        resolve(data?.data)
      } else {
        reject('保存系统设置失败')
      }
    });
  })


}

export default batchCreateService

