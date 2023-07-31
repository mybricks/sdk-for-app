// @ts-ignore
import axios from "axios";
import { isEnvOfServer } from './env'

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
  if(!AXIOS_INSTANCE) {
    init()
  }
  return AXIOS_INSTANCE
}

export {
  init,
  getAxiosInstance
}

