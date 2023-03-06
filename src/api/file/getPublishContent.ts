import { getAxiosInstance } from '../util'

interface VersionItem {
  id: number
  type: string
  fileId: number | null
  version: string
  createTime: string
  creatorId: string
  updateTime: string
}

interface VersionDetailItem extends VersionItem {
  content: {
    [keyName: string]: any
  }
}

export default (params: { pubId: number | string }): Promise<VersionDetailItem[]> => {
  return new Promise((resolve, reject) => {
    const { pubId } = params ?? {}
    getAxiosInstance()
    .get('/paas/api/workspace/publish/content', {
      id: pubId,
    }).then(({ data }) => {
      if (data?.data) {
        let content = data?.data?.content ?? {}
        try {
          content = JSON.parse(content || '{}')
        } catch (error) {
        }
        resolve({ ...data?.data, content } || {})
      } else {
        reject('查询发布内容失败')
      }
    })
  })

}