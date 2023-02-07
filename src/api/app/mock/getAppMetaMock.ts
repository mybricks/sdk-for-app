import getAppMeta from "../getAppMeta";

const getAppMetaMock: typeof getAppMeta = () => {
  return {
    namespace: "mybricks-app-namesapce",
    extName: "extName"
  }
}

export default getAppMetaMock;
