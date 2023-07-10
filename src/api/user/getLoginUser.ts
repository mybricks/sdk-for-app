import { getAxiosInstance } from '../util'

import { T_UserInfo } from "./type";

const getLoginUser: (params?: any) => Promise<T_UserInfo> = async (params = {}) => {
  let newParams = params ? {...params} : {}
  if(localStorage.getItem('HAINIU_UserInfo')) {
    newParams.HAINIU_UserInfo = localStorage.getItem('HAINIU_UserInfo')
  }
  return new Promise((resolve, reject) => {
    getAxiosInstance()
    .post(`/paas/api/user/signed`, newParams)
    .then(({ data }: any) => {
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
    }).catch((e: any) => {
      console.error(e)
      reject('获取用户信息失败失败')
    });
  })
}

export default getLoginUser

