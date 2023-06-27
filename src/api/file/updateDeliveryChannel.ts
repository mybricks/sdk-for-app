import { getAxiosInstance } from '../util'

/**
 * 更新投放渠道
 *
 * @param {{id: number, deliveryChannel: string}} params
 * @returns {Promise<{}>}
 */
function updateDeliveryChannel(params: {id: number, deliveryChannel: string}): Promise<{}> {
  return new Promise((resolve, reject) => {
    getAxiosInstance()
    .post('/paas/api/file/updateDeliveryChannel', params)
    .then(({data}: any) => {
      if (data?.code === 1) {
        resolve(data?.data);
      } else {
        reject('更新渠道失败');
      }
    }).catch((e: any) => {
      reject(e.msg || '更新渠道失败')
    })
  });
}

export default updateDeliveryChannel;
