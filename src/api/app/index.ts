import { isEnvOfDevAndBrowser } from "../../env";

import getInstalledList from './getInstalledList'
import getAppMeta from './getAppMeta'

import getAppMetaMock from './mock/getAppMetaMock'

const App = isEnvOfDevAndBrowser() ? {
  getAppMetaMock
} : {
  getAppMeta,
  getInstalledList,
}

export {
  App
}