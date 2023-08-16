import { getAxiosInstance } from '../util'

const createCooperationUser = ({userId, creatorId, groupId, fileId, roleDescription}: {userId: number, creatorId: number, groupId?: number, fileId?: number, roleDescription: number}) => {
  return new Promise((resolve, reject) => {
    if (!groupId && !fileId) {
      reject('协作组id和文件id至少需要有一个有效值')
    } else if (!userId || !creatorId) {
      reject('用户邮箱以及创建人ID不能为空')
    } else {
      getAxiosInstance()
        .post(`/paas/api/file/createCooperationUser`, {userId, creatorId, groupId, fileId, roleDescription})
        .then(({data}: any) => {
          if (data.code === 1 && data.data) {
            resolve(data.data)
          } else {
            reject('新增协作用户失败')
          }
        }).catch((e: any) => {
          reject(`新增协作用户失败:${e.msg || e.message}`)
        });
    }
  })
}

export default createCooperationUser
