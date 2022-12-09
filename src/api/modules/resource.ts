import { ResPage, Resource } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";

import http from "@/api";

/**
 * @name 权限组管理模块
 */
// * 获取权限组列表
export const getResourceList = (params: Resource.ReqGetResourceParams) => {
	return http.get<ResPage<Resource.ResResourceList>>(PORT1 + `/sysResource/page`, params);
};

// * 新增权限组
export const addResource = (params: { id: string }) => {
	return http.post(PORT1 + `/sysResource/add`, params);
};

// * 编辑权限组
export const editResource = (params: { id: string }) => {
	return http.post(PORT1 + `/sysResource/update`, params, { headers: { noLoading: true } });
};

// * 删除权限组
export const deleteResource = (params: { id: string[] }) => {
	return http.post(PORT1 + `/sysResource/delete`, params);
};

// * 切换权限组状态
export const changeResourceStatus = (params: { id: string; displayStatus: number }) => {
	return http.post(PORT1 + `/sysResource/update`, params);
};
