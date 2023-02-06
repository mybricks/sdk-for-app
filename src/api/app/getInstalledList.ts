import axios from "axios";


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
    axios({ 
      method: 'get', 
      url: '/paas/api/apps/getInstalledList',
    }).then(({ data }) => {
      if (data?.data) {
        resolve(data?.data || [])
      } else {
        reject('查询已安装应用失败')
      }
    }).catch(e => {
      reject(e.message || '查询已安装应用失败')
    });
  })


}

export default getInstalledList

