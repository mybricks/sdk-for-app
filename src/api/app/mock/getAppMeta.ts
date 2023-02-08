import fn from "../getAppMeta";

const getAppMeta: typeof fn = () => {
  return {
    namespace: "mybricks-app-namesapce",
    extName: "extName"
  };
}

export default getAppMeta;
