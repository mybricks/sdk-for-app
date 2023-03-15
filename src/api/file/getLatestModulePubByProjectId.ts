import { getAxiosInstance } from '../util'

const getLatestModulePubByProjectId = (params: {projectId: number, extNameList?: string[]}): Promise<{}> => {
  return new Promise((resolve, reject) => {
    getAxiosInstance()
    .post('/paas/api/module/getLatestModulePubByProjectId', params)
    .then(({data}: any) => {
      if (data?.code === 1) {
        resolve(data?.data);
      } else {
        reject('获取失败');
      }
    });
  });
}

export default getLatestModulePubByProjectId;
