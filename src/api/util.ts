// @ts-ignore
import axios from "axios";
import { isEnvOfServer } from '../env'

let AXIOS_INSTANCE: any = null

function init() {
  if(!AXIOS_INSTANCE) {
    if(isEnvOfServer()) {
      AXIOS_INSTANCE = axios.create({
        baseURL: process.env.NODE_ENV === 'development' ? 'http://localhost:3100/' : 'https://my.mybricks.world',
        // headers: {'X-Custom-Header': 'foobar'}
        // proxy: {
        //   protocol: 'http',
        //   host: '127.0.0.1',
        //   port: 9000,
        // },
      });
    } else {
      AXIOS_INSTANCE = axios.create({
        // headers: {'X-Custom-Header': 'foobar'}
        // proxy: {
        //   protocol: 'http',
        //   host: '127.0.0.1',
        //   port: 9000,
        // },
      });
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

