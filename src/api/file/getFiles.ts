import axios from 'axios';

const getAll = (params): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    axios({ 
      method: 'get', 
      url: '/paas/api/file/getFiles',
      params
    }).then(({ data }) => {
      if (data.code === 1 && data.data) {
        resolve(data.data)
      } else {
        reject('获取文件列表失败')
      }
    })
  })
}

export default getAll