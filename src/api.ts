import axios from 'axios';
import { API_CODE } from './ui/type'
import { getCookies, safeParse } from './utils';

const cookies = getCookies();
const user = safeParse(cookies['mybricks-login-user'])

type Namespace = 'system' | string

export const setting = {
  getSetting: (namespaces: Namespace[]) => {
    return axios({ 
      method: 'post', 
      url: '/api/config/get',
      data: {
        scope: namespaces
      }
    }).then(({ data }) => {
      if (data?.data) {
        return data?.data
      } else {
        throw new Error('获取设置失败')
      }
    })
  },
  saveSetting: (namespace: string, config: any) => {
    return axios({ 
      method: 'post', 
      url: '/api/config/update',
      data: {
        namespace: namespace,
        userId: user.email,
        config,
      }
    }).then(({ data }) => {
      const { code } = data ?? {};
      if (code === API_CODE.SUCCESS) {
        return true
      } else {
        throw new Error('保存系统设置失败')
      }
    })
  }
}

export const task = {
  exec: ({
    fileId,
    version,
  }: { fileId: string, version: string }, params) => {
    return axios({ 
      method: 'post', 
      url: '/api/system/task/run',
      data: {
        fileId,
        version,
        injectParam: JSON.stringify(params)
      }
    }).then(({ data }) => {
      const { code } = data ?? {};
      if (code === API_CODE.SUCCESS) {
        return true
      } else {
        throw new Error('执行系统任务失败')
      }
    })  
  }
}
