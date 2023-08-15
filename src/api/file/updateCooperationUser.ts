import { getAxiosInstance } from '../util'

const updateCooperationUser = ({userId, updatorId, groupId, fileId, roleDescription, status}: {userId: number, updatorId: string, groupId?: number, fileId?: number, roleDescription: number, status?: number}) => {
  return new Promise((resolve, reject) => {
    if (!groupId && !fileId) {
      reject('协作组id和文件id至少需要有一个有效值')
    } else if (!userId || !updatorId) {
      reject('用户邮箱以及更新人ID不能为空')
    } else {
      getAxiosInstance()
        .post(`/paas/api/file/updateCooperationUser`, {userId, updatorId, groupId, fileId, roleDescription, status})
        .then(({data}: any) => {
          if (data.code === 1 && data.data) {
            resolve(data.data)
          } else {
            reject('更新协作用户失败')
          }
        }).catch((e: any) => {
          reject(`更新协作用户失败:${e.msg || e.message}`)
        });
    }
  })
}

export default updateCooperationUser
