import { ReactElement } from "react";

export interface ViewProps {
  children: ReactElement;
  extName: "pc-page" | "cloud-com" | "material";
  className?: string;
  // 应用空间
  namespace: string;
}

export interface FileContent {
  content: string;
  creatorName: string;
  creatorId: string;
  /** 文件类型 */
  extName: string;
  name: string;
  id: number;
  namespace: string;
  /** 类型，比如云组件 pc-react、pc-vue */
  type: string;
  /** 版本 */
  version: string;
}

interface PublishParams {
  /** 发布类型，线上/测试/日常 */
  type: string;
  content: string;
  /** 发布信息 */
  commitInfo?: string;
}

interface IInstalledAppExports {
  type: string;
  name: string;
  path: string;
}

export interface IInstalledApp {
  title: string;
  namespace: string;
  type: string;
  homepage: string;
  icon: string;
  exports: IInstalledAppExports[];
}

export interface IConfig {
  system: any;
  [appNamespace: string]: any;
}

export interface ViewRef {
  fileId: number;
  installedApps: IInstalledApp[];
  user: {
    email: string;
    id: number;
  };
  openUrl: Function;
  fileContent: FileContent | null;
  config: IConfig;
  save(
    params: Record<string, unknown>,
    config?: { skipMessage?: boolean }
  ): Promise<void>;
  publish(
    params: PublishParams,
    config?: { skipMessage?: boolean }
  ): Promise<void>;
}
