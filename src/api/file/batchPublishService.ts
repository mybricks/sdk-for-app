import { getAxiosInstance } from '../util'

/**
 * 批量发布服务
 *
 * @param {{
 *   fileId: number,
 *   filePubId: number,
 *   projectId: number,
 *   serviceContentList: {serviceId: string, content: string}[],
 *   env: string,
 *   creatorName: string
 * }} params
 * @returns {Promise<{}>}
 */
function publish(params: {
  fileId: number,
  filePubId: number,
  projectId: number,
  serviceContentList: {serviceId: string, content: string}[],
  env: string,
  creatorName: string
}): Promise<{}> {
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
