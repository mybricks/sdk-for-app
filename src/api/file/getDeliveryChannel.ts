import { getAxiosInstance } from '../util'

/**
 * 获取页面投放地址
 *
 * @param {{ fileId: number }} params
 * @returns {Promise<any>}
 */
function getDeliveryChannel(params: { fileId: number }): Promise<any> {
  return new Promise((resolve, reject) => {
    const { fileId } = params || {}
    getAxiosInstance().get('/paas/api/file/getDeliveryChannel',{
      params: {
        id: fileId
      }
    }).then(({ data }: any) => {
      if (data?.code === 1) {
        resolve(data?.data || {})
      } else {
        reject('查询文件失败')
      }
    }).catch((e: any) => {
      reject(e.msg || '查询投放地址失败')
    })
  })
}

export default getDeliveryChannel
