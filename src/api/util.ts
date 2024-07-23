// @ts-ignore
import axios, { AxiosError } from "axios";
import { isEnvOfGlobalEmit, isEnvOfServer } from './env'

let AXIOS_INSTANCE: any = null

function init() {
  if(!AXIOS_INSTANCE) {
    if(isEnvOfServer()) {
      let baseURL = process.env.NODE_ENV === 'development' ? 'http://localhost:3100/' : 'https://my.mybricks.world/';
      if(process.env.MYBRICKS_PLATFORM_ADDRESS) {
        baseURL = process.env.MYBRICKS_PLATFORM_ADDRESS
      }
      AXIOS_INSTANCE = axios.create({
        baseURL: baseURL,
        // headers: {'X-Custom-Header': 'foobar'}
        // proxy: {
        //   protocol: 'http',
        //   host: '127.0.0.1',
        //   port: 9000,
        // },
      });
    } else {
      // @ts-ignore
      if(window.MYBRICKS_PLATFORM_ADDRESS) {
        AXIOS_INSTANCE = axios.create({
          // @ts-ignore
          baseURL: window.MYBRICKS_PLATFORM_ADDRESS,
        });
      } else {
        AXIOS_INSTANCE = axios.create({});
      }
    }
  }
}

function getAxiosInstance() {
  if (isEnvOfServer() && isEnvOfGlobalEmit()) {
    if (!AXIOS_INSTANCE) {
      AXIOS_INSTANCE = {
        get: async (path: string, param: { params: Record<string, unknown> }) => {
          return { data: await (global as any).emitGlobalEvent(path, 'GET', param?.params ?? {}) };
        },
        delete: async (path: string, param: { params: Record<string, unknown> }) => {
          return { data: await (global as any).emitGlobalEvent(path, 'DELETE', param?.params ?? {}) };
        },
        post: async (path: string, params: Record<string, unknown> = {}) => {
          return { data: await (global as any).emitGlobalEvent(path, 'POST', params) };
        },
        put: async (path: string, params: Record<string, unknown> = {}) => {
          return { data: await (global as any).emitGlobalEvent(path, 'PUT', params) };
        },
      };
    }
  } else {
    if(!AXIOS_INSTANCE) {
      init();
    }
  }

  return AXIOS_INSTANCE;
}

/** 从标准错误中获取错误字符串 */
function getMessageFromErrorException (err: Error, placeMessage = '未知错误') {
  if (err?.stack?.toString) {
    return err.stack.toString();
  }
  // @ts-ignore
  return err?.message || err?.msg || err?.errMsg || placeMessage
}

/** 从Axios错误中获取错误字符串 */
function getMessageFromAxiosErrorException (err: AxiosError, placeMessage = '未知错误') {
  const errorMessage = getMessageFromErrorException(err, '');
  if (err?.response) {
    return `HTTP 异常，状态码为 ${err.response.status}${err.response.statusText || ''}，错误详情为 ${errorMessage}`
  }

  return errorMessage || placeMessage
}


export {
  init,
  getAxiosInstance,
  getMessageFromErrorException,
  getMessageFromAxiosErrorException
}

