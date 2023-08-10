import { getAxiosInstance } from '../util'


/**
 * 获取应用配置
 *
 * @param {string[]} namespaces
 * @returns
 */
async function getSetting(namespaces: string[], options = {}) {
  return new Promise((resolve, reject) => {
    if(!namespaces || namespaces.length === 0) {
      resolve([]);
      return
    }
    getAxiosInstance()
    .post('/paas/api/config/get', {
      scope: namespaces,
      ...options
    })
    .then(({data: configData}: any) => {
      if (configData.code === 1) {
        const config = configData?.data;
        resolve(config)
      } else {
        reject(`获取全局配置项发生错误：${configData.message}`)
      }
    }).catch((e: any) => {
      reject(e.message || '获取全局配置项发生错误：')
    });
  })


}

export default getSetting

