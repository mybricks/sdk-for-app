import fn from "../getUserInfo";
import { USER_INFO } from "./const";

const getUserInfo: typeof fn = () => {
  return new Promise((resolve) => {
    resolve(USER_INFO);
  });
}

export default getUserInfo;
