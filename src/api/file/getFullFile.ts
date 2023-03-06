import { getAxiosInstance } from '../util'

type T_FullFile = {
  content: string;
  id: number;
  groupId: number | null;
  parentId: number | null;
  path: string | null;
  name: string;
  icon: string;
  description: string | null;
  version: string;
  updatorId: string | null;
  updatorName: string | null;
  creatorId: string;
  creatorName: string;
  _createTime: number;
  _updateTime: number;
  extName: string;
  type: string;
  status: number;
  namespace: string;
  shareType: number | null;
};

const getFullFile = (params: { userId: string, fileId: number }): Promise<T_FullFile> => {
  return new Promise((resolve, reject) => {
    getAxiosInstance()
    .get('/paas/api/workspace/getFullFile', params)
    .then(({ data }: any) => {
      if (data?.code === 1) {
        resolve(data?.data || {})
      } else {
        reject('查询文件失败')
      }
    })
  })
}

export default getFullFile