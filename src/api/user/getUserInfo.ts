import axios from "axios";
import type { T_UserInfo } from "./type";

/**
 * 获取文件内容
 * @param fileId 文件id
 */
const getUserInfo: (email: string) => Promise<T_UserInfo> = async (email: string) => {
  return new Promise((resolve, reject) => {
    if (!email) {
      reject('email不能为空')
      return
    }
    axios({
      method: "get",
      url: `/paas/api/user/queryBy?email=${email}`,
    }).then(({ data }) => {
      if (data?.data) {
        resolve(data?.data?.[0])
      } else {
        reject('获取用户信息失败失败')
      }
    });
  })


}

export default getUserInfo

