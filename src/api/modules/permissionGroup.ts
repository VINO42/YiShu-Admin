import { ResPage, PermissionGroup } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";

import http from "@/api";

/**
 * @name 权限组管理模块
 */
// * 获取权限组列表
export const getPermissionGroupList = (params: PermissionGroup.ReqGetPermissionGroupParams) => {
	return http.get<ResPage<PermissionGroup.ResPermissionGroupList>>(PORT1 + `/sysPermissionGroup/page`, params);
};

// * 新增权限组
export const addPermissionGroup = (params: { id: string }) => {
	return http.post(PORT1 + `/sysPermissionGroup/add`, params);
};

// * 编辑权限组
export const editPermissionGroup = (params: { id: string; versionStamp: number }) => {
	return http.post(PORT1 + `/sysPermissionGroup/update`, params, { headers: { noLoading: true } });
};

// * 删除权限组
export const deletePermissionGroup = (params: { id: string[] }) => {
	return http.post(PORT1 + `/sysPermissionGroup/delete`, params);
};

// * 切换权限组状态
export const changePermissionGroupStatus = (params: { id: string; displayStatus: number; versionStamp: number }) => {
	return http.post(PORT1 + `/sysPermissionGroup/update`, params);
};
// * 获取所有的权限树
export const getAllPerms = () => {
	return http.get(PORT1 + `/sysPermission/tree`);
};
// * 获取所有的权限树
export const getPermsbyGroupId = (params: { groupId: number }) => {
	return http.get(PORT1 + `/sysPermission/getPermsbyGroupId`, params);
};

// * 更新权限组的权限列表 TODO
export const updatePermsGroupPerms = (params: { groupId: number }) => {
	return http.post(PORT1 + `/sysPermission/updatePermsGroupPerms`, params);
};
