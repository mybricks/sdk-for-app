import { getAxiosInstance } from '../util'

interface InstalledApp {
  title: string,
  description?: string
  type: string,
  version: string,
  namespace: string
  icon: string
}


const getInstalledList = async () => {
  return new Promise((resolve, reject) => {
    getAxiosInstance()
    .get('/paas/api/apps/getInstalledList')
    .then(({ data }: any) => {
      if (data?.data) {
        resolve(data?.data || [])
      } else {
        reject('查询已安装应用失败')
      }
    }).catch((e: any) => {
      reject(e.message || '查询已安装应用失败')
    });
  })


}

export default getInstalledList

