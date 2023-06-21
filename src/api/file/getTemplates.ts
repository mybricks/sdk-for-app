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
function getTemplates(params: { templateGuideType: string, extName: string }): Promise<ITemplatesResponseDTO[]> {
  return new Promise((resolve, reject) => {
    const { extName, templateGuideType } = params || {}
    getAxiosInstance().get('/api/material/template/list',{
      params: {
        extName: extName,
        templateGuideType: templateGuideType,
      }
    }).then(({ data }: any) => {
      if (data?.data) {
        resolve(data?.data || [])
      } else {
        reject(data?.msg || '获取模板列表失败')
      }
    })
  })
}

export default getTemplates