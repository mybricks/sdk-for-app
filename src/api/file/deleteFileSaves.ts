import { getAxiosInstance } from '../util'

interface DeleteFileSavesOption {
  /** 文件ID */
  fileId: number,
  beforeAt?: number,
  beforeVersion?: string,
  beforeNVersion?: number
}

/**
 * @description 删除文件的保存版本
 * @param params - 删除文件保存版本的参数
 * @param params.fileId - 文件ID
 * @param params.beforeAt - 时间戳，在此时间之前的文件版本将被删除（可选）
 * @param params.beforeVersion - 具体版本号，在此版本之前的文件版本将被删除（可选）
 * @param params.beforeNVersion - 数字，在 N 个版本之前的文件版本将被删除（可选）
 */
function deleteFileSaves(params: DeleteFileSavesOption): Promise<void> {
  return new Promise((resolve, reject) => {
    getAxiosInstance()
    .post('/paas/api/fileContent/deleteInFile', params)
    .then(({data}: any) => {
      if (data?.code === 1) {
        resolve();
      } else {
        reject(data?.message ?? '删除失败，未知错误');
      }
    }).catch((e: any) => {
      reject(e?.message ?? '删除失败，未知错误')
    });
  });
}

export default deleteFileSaves;
