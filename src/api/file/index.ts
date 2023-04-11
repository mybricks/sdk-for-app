import { isEnvOfDevAndBrowser } from "../env";

import getAll from "./getAll";
import getPublishContent from './getPublishContent'
import getVersions from './getVersions'
import getFullFile from './getFullFile'
import save from './save'
import publish from './publish'
import getFileTreeMapByFile from './getFileTreeMapByFile'
import getFiles from './getFiles'
import getHierarchy from './getHierarchy'

import saveMock from "./mock/save";
import publishMock from "./mock/publish";
import getFullFileMock from "./mock/getFullFile";
import getFileInfoByBaseFileIdAndRelativePath from './getFileInfoByBaseFileIdAndRelativePath'
import batchPublishService from './batchPublishService'
import getLatestModulePubByProjectId from "./getLatestModulePubByProjectId";
import getFileRoot from "./getFileRoot";
import getLatestPub from './getLatestPub'

export const File: any = isEnvOfDevAndBrowser() ? {
  getFullFile: getFullFileMock,
  getAll,
  save: saveMock,
  publish: publishMock,
  getPublishContent,
  getVersions,
  getFileTreeMapByFile,
  getFiles,
  getFileRoot,
  getHierarchy,
} : {
  getLatestPub,
  getLatestModulePubByProjectId,
  getFullFile,
  getAll,
  save,
  publish,
  batchPublishService,
  getPublishContent,
  getVersions,
  getFileTreeMapByFile,
  getHierarchy,
  getFiles,
	getFileRoot,
  getFileInfoByBaseFileIdAndRelativePath
};
