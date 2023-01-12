import axios from 'axios';
import { InstalledApp } from './../type'

export default (): Promise<InstalledApp[]> => {
  return axios({ 
    method: 'get', 
    url: '/api/apps/getInstalledList',
  }).then(({ data }) => {
    if (data?.data) {
      return data?.data || []
    } else {
      throw new Error('查询已安装应用失败')
    }
  })
}