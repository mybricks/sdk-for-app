import axios from 'axios';

const save = (params: {userId, fileId, shareType, name, content, icon, namespace, type}): Promise<{}> => {
  return new Promise((resolve, reject) => {
    axios({ 
      method: 'get', 
      url: '/paas/api/workspace/saveFile',
      params: params
    }).then(({ data }) => {
      if (data?.code === 1) {
        resolve(data?.data);
      } else {
        reject('保存失败');
      }
    });
  });
}

export default save;
