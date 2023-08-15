import { getAxiosInstance } from '../util'

/**
 * 保存应用配置
 *
 * @param {string} namespace 应用namespace
 * @param {*} config 应用配置JSON字符串
 * @param {*} userId 用户userId
 * @param options {object}
 * @returns
 */
async function saveSetting(namespace: string, config: string, userId: any, options = {}) {
  return new Promise((resolve, reject) => {
    if(!userId) {
      reject('userId')
    }
    getAxiosInstance()
    .post('/paas/api/config/update', {
      namespace: namespace,
      userId,
      config,
      ...options
    }).then(({ data }: any) => {
      const { code } = data ?? {};
      if (code === 1) {
        resolve(true)
      } else {
        reject('保存系统设置失败')
      }
    });
  })


}

export default saveSetting

