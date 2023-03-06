import { getAxiosInstance } from '../util'

import { T_UserInfo } from "./type";

const getLoginUser: () => Promise<T_UserInfo> = async () => {
  return new Promise((resolve, reject) => {
    getAxiosInstance()
    .post(`/paas/api/user/signed`)
    .then(({ data }) => {
      console.log('接口返回', data)
      resolve(data.data)
      // if (data?.data) {
      //   resolve(data.data)
      // } else {
      //   message.info('未登录,即将重定向到登录页')
      //   setTimeout(() => {
      //     location.href = `/?redirectUrl=${encodeURIComponent(location.href)}`
      //   }, 1000)
      // }
    }).catch((e) => {
      console.error(e)
      reject('获取用户信息失败失败')
    });
  })
}

export default getLoginUser

