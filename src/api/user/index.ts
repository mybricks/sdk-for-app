import { isEnvOfDevAndBrowser } from "../../env";

import getUserInfo from "./getUserInfo";
import getLoginUser from "./getLoginUser";

import getUserInfoMock from "./mock/getUserInfo";
import getLoginUserMock from "./mock/getLoginUser";

export const User = isEnvOfDevAndBrowser() ? {
  getUserInfo: getUserInfoMock,
  getLoginUser: getLoginUserMock
} : {
  getUserInfo,
  getLoginUser
}
