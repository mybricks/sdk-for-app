import { getAxiosInstance } from '../util'

const getFiles = async ({ moduleId, parentId }: { moduleId: number, parentId?: number }) => {
  return new Promise((resolve, reject) => {
    getAxiosInstance()
    .post('/paas/api/module/getLatestFileList', {
      moduleId,
      parentId
    })
    .then(({data: filesData}: any) => {
      if (filesData.code === 1) {
        const config = filesData?.data;
        resolve(config)
      } else {
        reject(`获取模块文件发生错误：${filesData.message}`)
      }
    }).catch((e: any) => {
      reject(e.message || '获取模块文件发生错误：')
    });
  })


}

export default getFiles

