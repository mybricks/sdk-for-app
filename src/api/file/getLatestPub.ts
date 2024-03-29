import { getAxiosInstance } from '../util'

/**
 * 获取最新的发布记录
 *
 * @param {{fileId: number, type?: string }} params
 * @returns {Promise<{}>}
 */
function getLatestPub(params: {fileId: number, type?: string }): Promise<{}> {
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
      reject(e.msg || '获取最新发布记录失败')
    })
  })
}

export default getLatestPub;
