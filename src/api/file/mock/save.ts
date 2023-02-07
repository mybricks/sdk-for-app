import fn from "../save";
import { LOCAL_APP_DUMPJSON_KEY_PREFIX } from "./const";

const save: typeof fn = (params) => {
  return new Promise((resolve) => {
    const { fileId } = params;
    const localKey = `${LOCAL_APP_DUMPJSON_KEY_PREFIX}_${fileId}`;
    const localData = JSON.parse(window.localStorage.getItem(localKey) || "{}");

    Object.keys(params).forEach((key) => {
      const value = params[key];

      if (typeof value !== 'undefined') {
        localData[key] = value
      }
    });

    window.localStorage.setItem(localKey, JSON.stringify(localData));

    resolve({});
  });
}

export default save;
