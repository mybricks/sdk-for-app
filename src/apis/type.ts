export interface FileItem {
  id: number
  name: string
  parentId: number | null
  description: string | null
  extName: string
  createTime: string
  creatorId: string
  creatorName: string
  updateTime: string
}


export interface VersionItem {
  id: number
  type: string
  fileId: number | null
  version: string
  createTime: string
  creatorId: string
  updateTime: string
}

export interface VersionDetailItem extends VersionItem {
  content: {
    [keyName: string]: any
  }
}


export interface InstalledApp {
  title: string,
  description?: string
  type: string,
  version: string,
  namespace: string
  icon: string
}
