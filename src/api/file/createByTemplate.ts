import { getAxiosInstance } from '../util'

/**
 * 基于模版新建文件
 *
 * @param params {{
 *   userId: string, 新建人邮箱前缀
 *   name: string, 文件名称
 *   extName: string, 文件后缀
 *   templateId: number, 模版ID
 *   groupId?: number, 所属协作组ID
 *   parentId?: number, 所属文件夹ID
 * }}
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
    }).catch((e: any) => {
      reject(e.msg || '基于模版新建失败')
    });
  });
}

export default createFileBaseTemplate;
