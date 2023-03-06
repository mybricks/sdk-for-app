import { getAxiosInstance } from '../util'

const getSetting = async (namespaces: string[]) => {
  return new Promise((resolve, reject) => {
    if(!namespaces || namespaces.length === 0) {
      resolve([]);
      return
    }
    getAxiosInstance()
    .post('/paas/api/config/get', {
      scope: namespaces
    })
    .then(({data: configData}) => {
      if (configData.code === 1) {
        const config = configData?.data;
        resolve(config)
      } else {
        reject(`获取全局配置项发生错误：${configData.message}`)
      }
    }).catch(e => {
      reject(e.message || '获取全局配置项发生错误：')
    });
  })


}

export default getSetting

