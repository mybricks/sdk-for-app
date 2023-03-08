import { getAxiosInstance } from '../util'

interface IBatchCreateService {
  fileId: number,
  filePubId: number,
  projectId: number,
  serviceContentList: {serviceId: string, content: string}[],
  env: string,
  creatorName: string
}

const publish = (params: IBatchCreateService): Promise<{}> => {
  return new Promise((resolve, reject) => {
    getAxiosInstance()
    .post('/paas/api/file/publish/batchCreateService', params)
    .then(({data}: any) => {
      resolve(data);
    }).catch((e: any) => {
      reject('发布失败' + e.message);
    })
  })
}

export default publish;
