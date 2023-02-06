import axios from "axios";

const getSetting = async (namespaces: string[]) => {
  return new Promise((resolve, reject) => {
    axios({
      method: "post",
      url: "/paas/api/config/get",
      data: {
        scope: namespaces,
      },
    }).then(({ data }) => {
      if (data?.data) {
        resolve(data?.data)
      } else {
        reject('获取设置失败')
      }
    });
  })


}

export default getSetting

