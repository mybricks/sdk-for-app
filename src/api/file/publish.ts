import axios from 'axios';

const publish = (params: {userId, fileId, extName: string, content: string, commitInfo: string, type: string }): Promise<{}> => {
  return new Promise((resolve, reject) => {
    axios({
      method: 'post',
      url: '/paas/api/workspace/publish',
      data: params
    }).then(({data}) => {
      if (data?.code === 1) {
        resolve(data?.data);
      } else {
        reject('发布失败');
      }
    }).catch(e => {
      reject('发布失败' + e.message);
    })
  })
}

export default publish;
