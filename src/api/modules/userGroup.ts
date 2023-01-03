import { ResPage, UserGroup } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";

import http from "@/api";

/**
 * @name 用户组管理模块
 */
// * 获取用户组列表
export const getUserGroupList = (params: UserGroup.ReqGetUserGroupParams) => {
	return http.get<ResPage<UserGroup.ResUserGroupList>>(PORT1 + `/sysUserGroup/page`, params);
};

// * 新增用户组
export const addUserGroup = (params: { id: string }) => {
	return http.post(PORT1 + `/sysUserGroup/add`, params);
};

// * 编辑用户组
export const editUserGroup = (params: { id: string; versionStamp: number }) => {
	return http.post(PORT1 + `/sysUserGroup/update`, params, { headers: { noLoading: true } });
};

// * 删除用户组
export const deleteUserGroup = (params: { id: string[] }) => {
	return http.post(PORT1 + `/sysUserGroup/delete`, params);
};

// * 切换用户组状态
export const changeUserGroupStatus = (params: { id: string; displayStatus: number; versionStamp: number }) => {
	return http.post(PORT1 + `/sysUserGroup/update`, params);
};
