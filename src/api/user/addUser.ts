import { getAxiosInstance } from '../util'

/**
 * 注册用户
 *
 * @param {{name: string, email: string, avatar: string}} params
 * @returns {(Promise<{ code: 1 | -1, data: { userId: number } }>)}
 */
function addUser(params: {name: string, email: string, avatar: string}): Promise<{ code: 1 | -1, data: { userId: number } }> {
  return new Promise((resolve, reject) => {
    getAxiosInstance()
    .post('/paas/api/user/addUser', params)
    .then(({data}: any) => {
      resolve(data)
    }).catch((e: any) => {
      reject(e.msg || '注册用户失败')
    })
  });
}

export default addUser;
