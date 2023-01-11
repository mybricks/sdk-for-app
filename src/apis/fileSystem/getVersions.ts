import axios from 'axios';

interface FileItem {
  id: number
  name: string
  parentId: number | null
  description: string | null
  extName: string
  createTime: string
  creatorId: string
  creatorName: string
  updateTime: string
}

interface Params {
  fileId: number | string
  pageIndex?: number
  pageSize?: number
}

export default (params: Params): Promise<FileItem[]> => {
  const { fileId, pageIndex = 1, pageSize = 100 } = params ?? {}
  return axios({ 
    method: 'get', 
    url: '/api/workspace/publish/versions',
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