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

/**
 * 查询某一历史版本的发布内容
 *
 * @param {({ pubId: number | string })} params
 * @returns {Promise<VersionDetailItem>}
 */
function getPublishContent(params: { pubId: number | string }): Promise<VersionDetailItem> {
  return new Promise((resolve, reject) => {
    const { pubId } = params ?? {}
    getAxiosInstance()
    .get('/paas/api/workspace/publish/content', {
      params: {
        id: pubId,
      }
    }).then(({ data }: any) => {
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
    }).catch((e: any) => {
      reject(e.msg || '获取发布内容失败')
    })
  })

}

export default getPublishContent