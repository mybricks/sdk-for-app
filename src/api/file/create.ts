import { getAxiosInstance } from '../util'

/**
 * 新建文件
 *
 * @param {{
 *   name: string,
 *   creatorId: string,
 *   creatorName: string,
 *   extName: string,
 *   groupId?: number,
 *   description?: string,
 *   parentId?: number,
 *   icon?: string,
 * }} params
 * @returns {Promise<{ id: number }>}
 */
function create(params: {
  name: string,
  creatorId: string,
  creatorName: string,
  extName: string,
  groupId?: number,
  description?: string,
  parentId?: number,
  icon?: string,
}): Promise<{ id: number }> {
  return new Promise((resolve, reject) => {
    getAxiosInstance()
    .post('/paas/api/file/create', params)
    .then(({data}: any) => {
      if (data?.code === 1) {
        resolve(data?.data);
      } else {
        reject(data.msg || '新建失败');
      }
    }).catch((e: any) => {
      reject(e.msg || '新建页面失败')
    });
  });
}

export default create;
