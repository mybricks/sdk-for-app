import { getAxiosInstance } from '../util'

const getLatestComponentLibrariesByPOST = async (namespaces: Array<string>) => {
	return new Promise((resolve, reject) => {
		getAxiosInstance()
			.post('/api/material/getLatestComponentLibraries', { namespaces })
			.then(({ data }: any) => {
				if (data?.data) {
					resolve((data?.data || []).sort((p: any, c: any) => {
						return namespaces.indexOf(p.namespace) - namespaces.indexOf(c.namespace);;
					}))
				} else {
					reject('查询最新组件库信息失败')
				}
			}).catch((e: any) => {
			reject(e.msg || '查询最新组件库信息失败')
		});
	})
};

export default getLatestComponentLibrariesByPOST;
