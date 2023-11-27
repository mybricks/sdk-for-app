import { getAxiosInstance } from '../util'

/**
 * 根据fileId和发布版本查询保存内容
 *
 * @param {{fileId: number, pubVersion: string }} params
 * @returns {Promise<{}>}
 */
function getFileContentByFileIdAndPubVersion(params: {fileId: number, pubVersion: string }): Promise<{}> {
  return new Promise((resolve, reject) => {
    getAxiosInstance()
    .post('/paas/api/file/getFileContentByFileIdAndPubVersion', params)
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

export default getFileContentByFileIdAndPubVersion;
