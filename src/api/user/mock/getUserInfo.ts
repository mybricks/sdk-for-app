import { USER_INFO } from "./const";

function getUserInfo () {
  return new Promise((resolve) => {
    resolve(USER_INFO);
  });
}

export default getUserInfo;
