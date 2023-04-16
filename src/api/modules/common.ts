import { User } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";

import http from "@/api";

// * 获取用户状态
export const getUserStatus = () => {
	return http.get<User.ResStatus>(PORT1 + `/common/status`);
};
// * 获取用户状态
export const getResourceTypes = () => {
	return http.get<User.ResEnum>(PORT1 + `/common/resourceTypes`);
};
export const getAccountTypeEnum = () => {
	return http.get<User.ResStatus>(PORT1 + `/common/getAccountTypeEnum`);
};
export const getPlatformTypes = () => {
	return http.get<User.ResEnum>(PORT1 + `/common/getAccountTypeEnum`);
};
// * 获取用户性别字典
export const getUserGender = () => {
	return http.get<User.ResGender>(PORT1 + `/common/gender`);
};

// * 获取用户部门列表
export const getUserDepartment = () => {
	return http.get<User.ResDepartment>(PORT1 + `/user/department`);
};

// * 获取用户部门列表
export const updatePassword = (params: User.UpdatePasswordModel) => {
	return http.post(PORT1 + `/sysAccount/update/password`, params);
};
