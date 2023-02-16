import axios from 'axios';

export default (params): Promise<any> => {
  return new Promise((resolve, reject) => {
    axios({ 
      method: 'get', 
      url: '/paas/api/file/getFileTreeMapByFile',
      params
    }).then(({ data }) => {
      if (data.code === 1 && data.data) {
        resolve(data.data)
      } else {
        reject('获取文件树失败')
      }
    })
  })
}