import { ResPage, Account } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";

import http from "@/api";

/**
 * @name 管理模块
 */
// * 获取账号列表
export const getAccountList = (params: Account.ReqGetAccountParams) => {
	return http.get<ResPage<Account.ResAccountList>>(PORT1 + `/sysAccount/page`, params, {
		headers: { "content-type": "application/x-www-form-urlencoded" }
	});
};

// * 新增账号
export const addAccount = (params: { id: string }) => {
	return http.post(PORT1 + `/sysAccount/add`, params);
};

// * 批量添加账号
export const BatchAddAccount = (params: FormData) => {
	return http.post(PORT1 + `/sysAccount/import`, params);
};

// * 编辑账号
export const editAccount = (params: { id: string; versionStamp: number }) => {
	return http.post(PORT1 + `/sysAccount/update`, params, { headers: { noLoading: true } });
};

// * 删除账号
export const deleteAccount = (params: { id: string[] }) => {
	return http.post(PORT1 + `/sysAccount/delete`, params);
};

// * 切换账号状态
export const changeAccountStatus = (params: { id: string; displayStatus: number; versionStamp: number }) => {
	return http.post(PORT1 + `/sysAccount/update`, params);
};

// * 重置账号密码
export const resetAccountPassWord = (params: { id: string }) => {
	return http.post(PORT1 + `/sysAccount/rest_password`, params);
};

// * 导出账号数据
export const exportAccountInfo = (params: Account.ReqGetAccountParams) => {
	return http.post<BlobPart>(PORT1 + `/sysAccount/export`, params, { responseType: "blob" });
};

// * 获取账号状态
export const getAccountStatus = () => {
	return http.get<Account.ResStatus>(PORT1 + `/sysAccount/status`);
};
