import { getAxiosInstance } from '../util'

interface ITemplatesResponseDTO {
  id: number,
  title: string,
  templates: {
    file_id: number,
    title: string,
    version: string,
  }[]
}

/**
 * 获取模板列表
 *
 * @param {{ templateGuideType: string, extName: string }} params
 * @returns {Promise<any[]>}
 */

/**
 * 
 *
 * @param params {{
 *  sceneId: number  8表示H5模版
 * }
 * @returns {Promise<ITemplatesResponseDTO[]>}
 */
function getTemplates(params: { sceneId: number}): Promise<ITemplatesResponseDTO[]> {
  return new Promise((resolve, reject) => {
    getAxiosInstance()
    .post('/api/material/template/queryListBySceneId', params)
    .then(({ data }: any) => {
      if (data?.data) {
        resolve(data?.data || [])
      } else {
        reject(data?.msg || '获取模板列表失败')
      }
    }).catch((e: any) => {
      reject(e.msg || '查询模版列表失败')
    })
  })
}

export default getTemplates