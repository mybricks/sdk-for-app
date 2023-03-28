import exec from "./exec";

import execMock from "./mock/exec";

import { isEnvOfDevAndBrowser } from "../env";

export const Task = isEnvOfDevAndBrowser() ? {
  exec: execMock
} : {
  exec,
}