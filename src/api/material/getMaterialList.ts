import { getAxiosInstance } from "../util";

/**
 * 获取物料列表
 */
function getMaterialList(params: {
  pageSize?: number;
  page?: number;
  keyword?: string;
  type?: string;
  status?: string;
  scopeStatus?: string;
  scene?: string;
  userId?: string;
  tags?: string;
}): Promise<any> {
  return new Promise((resolve, reject) => {
    getAxiosInstance()
      .get("/api/material/list", { params })
      .then(({ data }: any) => {
        if (data?.code === 1 && data?.data) {
          resolve(data.data);
        } else {
          reject("查询物料列表失败");
        }
      })
      .catch((e: any) => reject(e.msg || "查询物料列表失败"));
  });
}

export default getMaterialList;
