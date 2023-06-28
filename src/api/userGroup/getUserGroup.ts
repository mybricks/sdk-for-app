import { getAxiosInstance } from '../util'

export default async function getUserGroup({id}: {id: number}) {
  return new Promise((resolve, reject) => {
    if (!id) {
      reject('协作组id不能为空')
      return
    }
    getAxiosInstance()
    .get(`/paas/api/userGroup/getUserGroup?id=${id}`)
    .then(({ data }: any) => {
      if (data.code === 1 && data.data) {
        resolve(data.data)
      } else {
        reject('获取协作组信息失败')
      }
    });
  })
}
