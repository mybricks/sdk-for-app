import { getAxiosInstance } from '../util'

/**
 * 新建文件
 *
 * @param {{
 *   fileId: number, 文件id
 *   updatorId: string, 删除者邮箱前缀
 * }} params
 * @returns {Promise<{}>}
 */
function deleteFile(params: {
  fileId: number,
  updatorId: string
}): Promise<{}> {
  return new Promise((resolve, reject) => {
    getAxiosInstance()
    .post('/paas/api/file/delete', params)
    .then(({data}: any) => {
      if (data?.code === 1) {
        resolve(data?.data);
      } else {
        reject(data.msg || '删除失败');
      }
    }).catch((e: any) => {
      reject(e.msg || '删除文件失败')
    });
  });
}

export default deleteFile;
