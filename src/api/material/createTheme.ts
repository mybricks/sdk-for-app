import { getAxiosInstance } from '../util'


/**
 * 创建主题
 *
 * @param {string[]} namespaces
 * @returns
 */
async function createTheme(params: { userId: string | number, namespace: string, themeConfig: any, title: string }) {
  return new Promise((resolve, reject) => {
    getAxiosInstance()
    .post('/api/material/theme/create', params)
    .then(({data}: any) => {
      if (data.code === 1) {
        resolve(data)
      } else {
        reject(`创建主题失败，${data.msg}`)
      }
    }).catch((e: any) => {
      reject(e.message || '创建主题失败')
    });
  })


}

export default createTheme

