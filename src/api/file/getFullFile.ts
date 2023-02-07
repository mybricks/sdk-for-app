import axios from 'axios';

const getFullFile = (params: { userId: string, fileId: number }): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'get',
      url: '/paas/api/workspace/getFullFile',
      params: params
    }).then(({ data }) => {
      if (data?.code === 1) {
        resolve(data?.data || {})
      } else {
        reject('查询文件失败')
      }
    })
  })
}

export default getFullFile