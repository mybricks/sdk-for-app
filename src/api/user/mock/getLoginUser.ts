import fn from "../getLoginUser";
import { USER_INFO } from "./const";

const getLoginUser: typeof fn =  () => {
  return new Promise((resolve) => {
    resolve(USER_INFO);
  });
}

export default getLoginUser;
