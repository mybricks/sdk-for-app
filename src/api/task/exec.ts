import axios from "axios";

/**
 * 获取文件内容
 * @param fileId 文件id
 */
const exec = async ({ fileId, version }: { fileId: string; version: string }, params: any) => {
  return new Promise((resolve, reject) => {
    axios({
      method: "post",
      url: "/paas/api/system/task/run",
      data: {
        fileId,
        version,
        injectParam: params,
      },
    }).then(({ data }: any) => {
      const { code, msg, message } = data ?? {};
      if (code === 1) {
        resolve(true)
      } else {
        reject(msg || message || "执行任务失败")
      }
    }).catch(e => {
      reject(e.message || '执行任务失败')
    });
  })


}

export default exec

