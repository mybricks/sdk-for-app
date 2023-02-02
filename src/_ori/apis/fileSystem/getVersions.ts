import axios from 'axios';
import { VersionItem } from './../type'

interface Params {
  fileId: number | string
  pageIndex?: number
  pageSize?: number
}

export default (params: Params): Promise<VersionItem[]> => {
  const { fileId, pageIndex = 1, pageSize = 100 } = params ?? {}
  return axios({ 
    method: 'get', 
    url: '/paas/api/workspace/publish/versions',
    params: {
      fileId,
      pageIndex,
      pageSize
    }
  }).then(({ data }) => {
    if (data?.data) {
      return data?.data || []
    } else {
      throw new Error('查询文件失败')
    }
  })
}