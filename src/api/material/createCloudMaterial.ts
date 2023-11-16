import { getAxiosInstance } from '../util'

export interface CreateMaterialComponent {
  /** 组件名 */
  title: string;
  /** 命名空间，workspace 下全局唯一 */
  namespace: string;
  /** 版本 */
  version: string;
  /** 描述信息 */
  description?: string;
  /** 缩略图 */
  icon?: string;
  /** 预览图 */
  previewImg?: string;
  /** 运行代码 */
  runtime: string;
  /** 编辑项代码 */
  editors: string;
  upgrade?: string;
  /** 输入 */
  inputs: string;
  /** 输出 */
  outputs: string;
  /** 初始数据 */
  data: string;
  /** 云组件依赖项 */
  deps: Array<Record<string, unknown>>;
  /** 发布信息 */
  commitInfo?: string;
  /** 编辑项代码 sourcemap，保留字段 */
  editorsSourceMap?: string;
  /** 运行代码 sourcemap，保留字段 */
  runtimeSourceMap?: string;
  /** 开发者id */
  author?: string;
  /** 开发者名称 */
  author_name?: string;
  /** 插槽 */
  slots?: string;
  /** 接入ai能力 */
  ai?: string;
  /** 出码 */
  target?: {
    toReact?: string;
  };
  /** 预览图 */
  preview?: string;
  /** TODO */
  /** 小程序代码片段，例如使用到js计算等 */
  codeArray?: Array<{id: string, code: string}>
  /** 小程序组件运行时代码 */
  mpruntime?: string;
  /** 云组件标签 */
  tags?: string[];
  schema?: any;
}

/** 创建物料 */
const createCloudMaterial = (params: {
  userId: string;
  /** 场景，如 H5/PC */
  sceneType?: string;
} & CreateMaterialComponent): Promise<string> => {
  return new Promise((resolve, reject) => {
    getAxiosInstance()
      .post('/api/material/component/create', params)
      .then(({ data }: { data?: { code: number, message: string} }) => {
        if (data) {
          if (data.code === 1) {
            resolve(data.message)
          } else {
            reject(data.message)
          }
        } else {
          reject('[component/create 发布物料] 错误: 返回data为null')
        }
      })
      .catch((err: any) => {
        reject(`[component/create 发布物料] 错误: ${err}`)
      })
  })
}

export default createCloudMaterial;