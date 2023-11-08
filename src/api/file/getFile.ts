import { getAxiosInstance } from '../util'

/**
 * 获取文件基本信息
 *
 * @param {{id: number}} {id}
 * @returns
 */
function getFile({id}: {id: number}) {
  return new Promise((resolve, reject) => {
    if (!id) {
      reject('文件id不能为空')
      return
    }
    getAxiosInstance()
      .get('/paas/api/file/getFile', { params: { id } })
      .then(({ data }: any) => {
        if (data.code === 1 && data.data) {
          resolve(data.data)
        } else {
          reject('获取文件信息失败')
        }
      }).catch((e: any) => {
        reject(`获取文件失败:${e.msg || e.message}`)
      });
  })
}

export default getFile