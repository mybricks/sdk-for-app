import { isEnvOfDevAndBrowser } from "../../env";

import getInstalledList from './getInstalledList'
import getAppMeta from './getAppMeta'

import getAppMetaMock from './mock/getAppMetaMock'

const App = isEnvOfDevAndBrowser() ? {
  getAppMeta: getAppMetaMock,
  getInstalledList
} : {
  getAppMeta,
  getInstalledList,
}

export {
  App
}