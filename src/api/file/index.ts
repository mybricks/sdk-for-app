import { isEnvOfDevAndBrowser } from "../../env";

import getAll from "./getAll";
import getPublishContent from './getPublishContent'
import getVersions from './getVersions'
import getFullFile from './getFullFile'
import save from './save'

import saveMock from "./mock/save";
import getFullFileMock from "./mock/getFullFile";

export const File = isEnvOfDevAndBrowser() ? {
  getFullFile: getFullFileMock,
  getAll,
  save: saveMock,
  getPublishContent,
  getVersions,
} : {
  getFullFile,
  getAll,
  save,
  getPublishContent,
  getVersions,
};
