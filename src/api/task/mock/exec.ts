import { message } from 'antd';

import fn from "../exec";

const exec: typeof fn = async (option, params) => {
  return new Promise((resolve) => {
    const data = {
      fileId: option.fileId,
      version: option.version,
      injectParam: JSON.stringify(params)
    };

    console.log(data, "请求体");

    message.info(`发布内容已打印至控制台`);

    resolve(data);
  });
}

export default exec;
