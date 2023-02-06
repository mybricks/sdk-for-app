import axios from "axios";

/**
 * 获取文件内容
 * @param fileId 文件id
 */
const exec = async ({ fileId, version }: { fileId: string; version: string }, params) => {
  return new Promise((resolve, reject) => {
    axios({
      method: "post",
      url: "/paas/api/system/task/run",
      data: {
        fileId,
        version,
        injectParam: JSON.stringify(params),
      },
    }).then(({ data }) => {
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

