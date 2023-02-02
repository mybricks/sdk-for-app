import axios from 'axios';
import { VersionDetailItem } from './../type'

interface Params {
  pubId: number | string
}

export default (params: Params): Promise<VersionDetailItem[]> => {
  const { pubId } = params ?? {}
  return axios({ 
    method: 'get', 
    url: '/paas/api/workspace/publish/content',
    params: {
      id: pubId,
    }
  }).then(({ data }) => {
    if (data?.data) {
      let content = data?.data?.content ?? {}
      try {
        content = JSON.parse(content || '{}')
      } catch (error) {
      }
      return { ...data?.data, content } || {}
    } else {
      throw new Error('查询发布内容失败')
    }
  })
}