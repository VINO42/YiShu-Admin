import { User } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";

import http from "@/api";

// * 获取用户状态
export const getUserStatus = () => {
	return http.get<User.ResStatus>(PORT1 + `/sysUser/status`);
};

// * 获取用户性别字典
export const getUserGender = () => {
	return http.get<User.ResGender>(PORT1 + `/sysUser/gender`);
};

// * 获取用户部门列表
export const getUserDepartment = () => {
	return http.get<User.ResDepartment>(PORT1 + `/user/department`);
};
