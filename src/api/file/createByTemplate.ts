import { getAxiosInstance } from '../util'

/**
 * 新建文件
 *
 * @param {{
 *   name: string, 文件名称
 *   creatorId: string, 新建人邮箱前缀
 *   creatorName: string, 新建人名称
 *   extName: string, 文件后缀
 *   groupId?: number, 所属协作组ID
 *   description?: string, 文件描述
 *   parentId?: number, 所属文件夹ID
 *   icon?: string, 文件图标
 * 
 * }} params
 * @returns {Promise<{}>}
 */
function createFileBaseTemplate(params: {
  userId: string,
  name: string,
  extName: string,
  templateId: number,
  groupId?: number,
  parentId?: number,
}): Promise<{}> {
  return new Promise((resolve, reject) => {
    getAxiosInstance()
    .post('/paas/api/file/createFileBaseTemplate', params)
    .then(({data}: any) => {
      if (data?.code === 1) {
        resolve(data?.data);
      } else {
        reject(data.msg || '新建失败');
      }
    });
  });
}

export default createFileBaseTemplate;
