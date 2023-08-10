import { getAxiosInstance } from '../util'

/**
 * 保存应用配置
 *
 * @param {string} namespace 应用namespace
 * @param {*} config 应用配置JSON字符串
 * @param {*} email 用户email
 * @returns
 */
async function saveSetting(namespace: string, config: string, email: any, options = {}) {
  return new Promise((resolve, reject) => {
    if(!email) {
      reject('请传入email')
    }
    getAxiosInstance()
    .post('/paas/api/config/update', {
      namespace: namespace,
      userId: email,
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

