import { getAxiosInstance } from '../util'

/**
 * 注册用户
 * 
 * @param {{name: string, email: string, avatar: string}} params
 * @returns {Promise<{ userId: number }>}
 */
function addUser(params: {name: string, email: string, avatar: string}): Promise<{ userId: number }> {
  return new Promise((resolve, reject) => {
    getAxiosInstance()
    .post('/paas/api/user/addUser', params)
    .then(({data}: any) => {
      if (data?.code === 1) {
        resolve(data?.data);
      } else {
        reject('注册用户失败');
      }
    }).catch((e: any) => {
      reject(e.msg || '注册用户失败')
    })
  });
}

export default addUser;
