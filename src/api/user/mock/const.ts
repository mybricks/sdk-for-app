import type { T_UserInfo } from '../type';

const USER_NAME: "dev" = "dev";

export const USER_INFO: T_UserInfo = {
  id: 1,
  name: USER_NAME,
  email: `${USER_NAME}@mock.com`,
  isAdmin: true,
  createTime: "2023-01-01 00:00:00",
  licenseCode: "0000-0000-0000-0000"
};
