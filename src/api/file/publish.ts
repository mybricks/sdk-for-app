import { getAxiosInstance } from '../util'

const publish = (params: {userId, fileId, extName: string, content: string, commitInfo: string, type: string }): Promise<{}> => {
  return new Promise((resolve, reject) => {
    getAxiosInstance()
    .post('/paas/api/workspace/publish', params)
    .then(({data}) => {
      if (data?.code === 1) {
        resolve(data?.data);
      } else {
        reject('发布失败');
      }
    }).catch(e => {
      reject('发布失败' + e.message);
    })
  })
}

export default publish;
