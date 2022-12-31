import { ResPage, User, UserGroup } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";

import http from "@/api";

/**
 * @name 用户管理模块
 */
// * 获取用户列表
export const getUserList = (params: User.ReqGetUserParams) => {
	return http.get<ResPage<User.ResUserList>>(PORT1 + `/sysUser/page`, params);
};

// * 新增用户
export const addUser = (params: { id: string }) => {
	return http.post(PORT1 + `/user/add`, params);
};

// * 批量添加用户
export const BatchAddUser = (params: FormData) => {
	return http.post(PORT1 + `/user/import`, params);
};

// * 编辑用户
export const editUser = (params: { id: string }) => {
	return http.post(PORT1 + `/sysUser/update`, params, { headers: { noLoading: true } });
};

// * 删除用户
export const deleteUser = (params: { id: string[] }) => {
	return http.post(PORT1 + `/sysUser/delete`, params);
};

// * 切换用户状态
export const changeUserStatus = (params: { id: string; displayStatus: number }) => {
	return http.post(PORT1 + `/sysUser/update`, params);
};

// * 重置用户密码
export const resetUserPassWord = (params: { id: string }) => {
	return http.post(PORT1 + `/sysUser/rest_password`, params);
};

// * 导出用户数据
export const exportUserInfo = (params: User.ReqGetUserParams) => {
	return http.post<BlobPart>(PORT1 + `/sysUser/export`, params, { responseType: "blob" });
};

// * 获取用户状态
export const getUserStatus = () => {
	return http.get<User.ResStatus>(PORT1 + `/common/status`);
};

// * 获取用户性别字典
export const getUserGender = () => {
	return http.get<User.ResGender>(PORT1 + `/common/gender`);
};
// * 分配用户组
export const alocateUserGroup = (params: { id: string; ids: string[] }) => {
	return http.post(PORT1 + `/sysUser/alocateUserGroup`, params, { headers: { noLoading: true } });
};
// * 分配用户角色
export const alocateUserRole = (params: { id: string }) => {
	return http.post(PORT1 + `/sysUser/alocateUserRole`, params, { headers: { noLoading: true } });
};
// * 给角色分配资源组
export const alocatRolePermissionGroup = (params: { id: string }) => {
	return http.post(PORT1 + `/sysUser/alocatRolePermissionGroup`, params, { headers: { noLoading: true } });
};
// * 获取所有的用户组列表
export const getAllocateUserGroupList = () => {
	return http.get<UserGroup.ResAllocateList[]>(PORT1 + `/sysUserGroup/getAllocateUserGroupList`, {
		headers: { noLoading: true }
	});
};
// * 获取所有的用户角色列表
export const getAllocateRoleList = () => {
	return http.get<UserGroup.ResAllocateList[]>(PORT1 + `/sysRole/getAllocateUserRoleList`, {
		headers: { noLoading: true }
	});
};
// * 获取所有的用户角色列表
export const getAllResourceList = () => {
	return http.get<UserGroup.ResAllocateList[]>(PORT1 + `/sysResource/getAllocateUserRoleList`, {
		headers: { noLoading: true }
	});
};
// * 获取所有的用户角色列表
export const getAllPermissionGroupList = () => {
	return http.get<UserGroup.ResAllocateList[]>(PORT1 + `/sysPermissionGroup/getAllPermissionGroupList`, {
		headers: { noLoading: true }
	});
};
// * 获取某个用户的用户组列表信息
export const getUserGroupIdList = (params: { userId: string }) => {
	return http.get<UserGroup.ResUserGroupRolesList[]>(PORT1 + `/sysUser/getUserGroupIdList`, params, {
		headers: { noLoading: true }
	});
};

// * 获取某个用户的用户组列表信息
export const getUserRoleIdList = (params: { userId: string }) => {
	return http.get<UserGroup.ResUserGroupRolesList[]>(PORT1 + `/sysUser/getUserRoleIdList`, params, {
		headers: { noLoading: true }
	});
};

// * 获取某个角色的资源列表信息
export const getResourceIdList = (params: { userId: string }) => {
	return http.get<UserGroup.ResUserGroupRolesList[]>(PORT1 + `/sysUser/getResourceIdList`, params, {
		headers: { noLoading: true }
	});
};

// * 获取某个角色的资源列表信息
export const getRolePermissionGroupList = (params: { userId: string }) => {
	return http.get<UserGroup.ResUserGroupRolesList[]>(PORT1 + `/sysUser/getRolePermissionGroupList`, params, {
		headers: { noLoading: true }
	});
};
