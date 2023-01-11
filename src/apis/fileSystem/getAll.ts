import axios from 'axios';
import { getUserInfo } from './../../utils'

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

export default (params = {}): Promise<FileItem[]> => {
  const { parentId } = params
  const userInfo = getUserInfo()
  return axios({ 
    method: 'get', 
    url: '/api/workspace/getAll',
    params: {
      userId: userInfo?.email,
      parentId,
    }
  }).then(({ data }) => {
    if (data?.data) {
      return data?.data || []
    } else {
      throw new Error('查询文件失败')
    }
  })
}