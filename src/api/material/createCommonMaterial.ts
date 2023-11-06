import { getAxiosInstance } from '../util'

/** 创建物料 */
const createCommonMaterial = (params: {
  userId: string;
  namespace: string;
  type?: string;
  icon?: string;
  previewImg?: string;
  title: string;
  description?: string;
  meta?: string;
  content: string;
  scene: {
    type: string;
    title: string;
  };
  tags?: string[];
}): Promise<string> => {
  return new Promise((resolve, reject) => {
    getAxiosInstance()
      .get('/api/material/common/create', { params })
      .then(({ data }: { data?: { code: number, message: string} }) => {
        if (data) {
          if (data.code === 1) {
            resolve(data.message)
          } else {
            reject(data.message)
          }
        } else {
          reject('[common/create 发布物料] 错误: 返回data为null')
        }
      })
      .catch((err: any) => {
        reject(`[common/create 发布物料] 错误: ${err}`)
      })
  })
}

export default createCommonMaterial;