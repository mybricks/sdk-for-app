import { isEnvOfDevAndBrowser } from "../../env";

import getSetting from "./getSetting";
import saveSetting from "./saveSetting";

import getSettingMock from "./mock/getSetting";

export const Setting = isEnvOfDevAndBrowser() ? {
  getSetting: getSettingMock,
  saveSetting
} : {
  getSetting,
  saveSetting
}