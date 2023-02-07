import { USER_INFO } from "./const";

function getLoginUser () {
  return new Promise((resolve) => {
    resolve(USER_INFO);
  });
}

export default getLoginUser;
