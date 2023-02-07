import fn from "../getFullFile";
import { LOCAL_APP_DUMPJSON_KEY_PREFIX } from "./const";

const getFullFile: typeof fn = (params) => {
  return new Promise((resolve) => {
    const localKey = `${LOCAL_APP_DUMPJSON_KEY_PREFIX}_${params.fileId}`;
    
    resolve(JSON.parse(window.localStorage.getItem(localKey) || "{}"));
  })
}

export default getFullFile;
