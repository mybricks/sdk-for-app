import axios from "axios";

const getLoginUser = async () => {
  return new Promise((resolve, reject) => {
    axios({
      method: "post",
      url: `/paas/api/user/signed`,
    }).then(({ data }) => {
      if (data?.data) {
        resolve(data?.data)
      } else {
        reject('获取用户信息失败失败')
      }
    }).catch(() => {
      reject('获取用户信息失败失败')
    });
  })


}

export default getLoginUser

