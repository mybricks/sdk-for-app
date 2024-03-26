import { getAxiosInstance } from '../util'
import type { T_UserInfo } from "./type";

/**
 * 获取用户信息
 *
 * @param {string} email 用户邮箱
 * @returns {Promise<T_UserInfo>}
 */
async function searchUserByKeyword({ keyword }: any): Promise<T_UserInfo> {
  return new Promise((resolve, reject) => {
    if (!keyword) {
      reject('keyword不能为空');
      return
    }

    getAxiosInstance()
    .post('/paas/api/user/searchByKeyword', { keyword })
    .then(({ data }: any) => {
      if (data?.code === 1) {
        resolve(data?.data)
      } else {
        reject('获取用户信息失败失败')
      }
    });
  })


}

export default searchUserByKeyword

