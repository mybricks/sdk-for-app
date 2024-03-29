// @ts-ignore
import axios from "axios";
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

export {
  init,
  getAxiosInstance
}

