import { getAxiosInstance } from '../util'
import type { T_UserInfo } from "./type";

/**
 * 获取用户信息
 *
 * @param {string} email 用户邮箱
 * @returns {Promise<T_UserInfo>}
 */
async function getUserInfo(email: string): Promise<T_UserInfo> {
  return new Promise((resolve, reject) => {
    if (!email) {
      reject('email不能为空');
      return
    }

    getAxiosInstance()
    .get('/paas/api/user/queryBy', { params: { email } })
    .then(({ data }: any) => {
      if (data?.data) {
        resolve(data?.data?.[0])
      } else {
        reject('获取用户信息失败失败')
      }
    });
  })


}

export default getUserInfo

