import { getAxiosInstance } from '../util'

/**
 * 根据fileId获取最新的保存记录
 *
 * @param {{fileId: number }} params
 * @returns {Promise<{}>}
 */
function getLatestSave(params: {fileId: number }): Promise<{}> {
  return new Promise((resolve, reject) => {
    getAxiosInstance()
    .post('/paas/api/file/getLatestSave', params)
    .then(({data}: any) => {
      if (data?.code === 1) {
        resolve(data?.data);
      } else {
        reject('获取失败');
      }
    }).catch((e: any) => {
      reject(e.msg || '获取保存内容失败')
    })
  })
}

export default getLatestSave;
