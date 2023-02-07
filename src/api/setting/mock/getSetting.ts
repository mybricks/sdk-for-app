import fn from "../getSetting";

import API from "../../index";

const getSetting: typeof fn = async (namespaces: string[]) => {
  return new Promise((resolve) => {
    const meta = API.App.getAppMeta();
    const final = {
      [meta.namespace]: {
        config: {},
      },
    };
    namespaces.forEach((namespace) => {
      final[namespace] = {
        config: {},
      };
    });
    resolve(final);
  });
}

export default getSetting

