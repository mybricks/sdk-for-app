import { isEnvOfDevAndBrowser } from "../../env";

import getAll from "./getAll";
import getPublishContent from './getPublishContent'
import getVersions from './getVersions'
import getFullFile from './getFullFile'
import save from './save'
import publish from './publish'

import saveMock from "./mock/save";
import publishMock from "./mock/publish";
import getFullFileMock from "./mock/getFullFile";

export const File = isEnvOfDevAndBrowser() ? {
  getFullFile: getFullFileMock,
  getAll,
  save: saveMock,
  publish: publishMock,
  getPublishContent,
  getVersions,
} : {
  getFullFile,
  getAll,
  save,
  publish,
  getPublishContent,
  getVersions,
};
