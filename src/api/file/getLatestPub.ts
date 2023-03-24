import { getAxiosInstance } from '../util'

const publish = (params: {fileId: number, type?: string }): Promise<{}> => {
  return new Promise((resolve, reject) => {
    getAxiosInstance()
    .post('/paas/api/file/getLatestPub', params)
    .then(({data}: any) => {
      if (data?.code === 1) {
        resolve(data?.data);
      } else {
        reject('获取失败');
      }
    }).catch((e: any) => {
      reject('获取失败' + e.message);
    })
  })
}

export default publish;
