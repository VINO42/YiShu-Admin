import { ResPage, Role } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";

import http from "@/api";

/**
 * @name 角色管理模块
 */
// * 获取角色列表
export const getRoleList = (params: Role.ReqGetRoleParams) => {
	return http.get<ResPage<Role.ResRoleList>>(PORT1 + `/sysRole/page`, params);
};

// * 新增角色
export const addRole = (params: { id: string }) => {
	return http.post(PORT1 + `/sysRole/add`, params);
};

// * 编辑角色
export const editRole = (params: { id: string; versionStamp: number }) => {
	return http.post(PORT1 + `/sysRole/update`, params, { headers: { noLoading: true } });
};

// * 删除角色
export const deleteRole = (params: { id: string[] }) => {
	return http.post(PORT1 + `/sysRole/delete`, params);
};

// * 切换角色状态
export const changeRoleStatus = (params: { id: string; displayStatus: number; versionStamp: number }) => {
	return http.post(PORT1 + `/sysRole/update`, params);
};
