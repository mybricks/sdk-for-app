import { getAxiosInstance } from '../util'

const getMaterialContent = (params: { namespace: string; version?: string; codeType?: string }): Promise<any> => {
	return new Promise((resolve, reject) => {
		getAxiosInstance()
			.get('/api/material/namespace/content', { params })
			.then(({ data }: any) => {
				if (data?.code === 1 && data?.data) {
					resolve(data.data)
				} else {
					reject('查询物料内容失败')
				}
			})
			.catch((e: any) => reject(e.msg || '查询物料内容失败'));
	})
}

export default getMaterialContent;
