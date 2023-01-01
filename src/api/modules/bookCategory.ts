import { ResPage, BookCategory } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";

import http from "@/api";

/**
 * @name 用户组管理模块
 */
// * 获取用户组列表
export const getBookCategoryList = (params: BookCategory.ReqGetBookCategoryParams) => {
	return http.get<ResPage<BookCategory.ResBookCategoryList>>(PORT1 + `/bookCategory/page`, params);
};

// * 新增用户组
export const addBookCategory = (params: { id: string }) => {
	return http.post(PORT1 + `/bookCategory/add`, params);
};

// * 编辑用户组
export const editBookCategory = (params: { id: string }) => {
	return http.post(PORT1 + `/bookCategory/update`, params, { headers: { noLoading: true } });
};

// * 删除用户组
export const deleteBookCategory = (params: { id: string[] }) => {
	return http.post(PORT1 + `/bookCategory/delete`, params);
};

// * 切换用户组状态
export const changeBookCategoryStatus = (params: { id: string; displayStatus: number }) => {
	return http.post(PORT1 + `/bookCategory/update`, params);
};
