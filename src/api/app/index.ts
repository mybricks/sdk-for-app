import { isEnvOfDevAndBrowser } from "../env";

import getInstalledList from "./getInstalledList";
import getAppMeta from "./getAppMeta";
import getPreviewImage from "./getPreviewImage";

import getAppMetaMock from "./mock/getAppMeta";
import getInstalledListMock from "./mock/getInstalledList";

const App = isEnvOfDevAndBrowser() ? {
  getAppMeta: getAppMetaMock,
  getInstalledList: getInstalledListMock,
  getPreviewImage
} : {
  getAppMeta,
  getInstalledList,
  getPreviewImage
}

export {
  App
}