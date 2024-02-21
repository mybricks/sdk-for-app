import { getAxiosInstance } from '../util'


/**
 * 获取指定环境、版本的发布资产地址
 *
 * @param {{fileId: number, envType: string, version: string }} params
 * @returns {Promise<{}>}
 */
function getPubAssetPath(params: {fileId: number, envType: string, version: string }): Promise<{}> {
  return new Promise((resolve, reject) => {
    getAxiosInstance()
    .post('/paas/api/workspace/publish/getPubAsset', params)
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

export default getPubAssetPath;
