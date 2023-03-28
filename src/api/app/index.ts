import { isEnvOfDevAndBrowser } from "../env";

import getInstalledList from "./getInstalledList";
import getAppMeta from "./getAppMeta";

import getAppMetaMock from "./mock/getAppMeta";
import getInstalledListMock from "./mock/getInstalledList";

const App = isEnvOfDevAndBrowser() ? {
  getAppMeta: getAppMetaMock,
  getInstalledList: getInstalledListMock
} : {
  getAppMeta,
  getInstalledList,
}

export {
  App
}