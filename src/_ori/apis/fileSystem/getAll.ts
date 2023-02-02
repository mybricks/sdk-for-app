import axios from 'axios';
import { getUserInfo } from './../../utils'
import { FileItem } from './../type'

export default (params = {}): Promise<FileItem[]> => {
  const { parentId } = params
  const userInfo = getUserInfo()
  return axios({ 
    method: 'get', 
    url: '/paas/api/workspace/getAll',
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