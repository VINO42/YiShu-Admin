import { ResPage, BookCategory } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";

import http from "@/api";

/**
 * @name 图书类别管理模块
 */
// * 获取图书类别列表
export const getBookCategoryList = (params: BookCategory.ReqGetBookCategoryParams) => {
	return http.get<ResPage<BookCategory.ResBookCategoryList>>(PORT1 + `/bookCategory/page`, params);
};

// * 新增图书类别
export const addBookCategory = (params: { id: string }) => {
	return http.post(PORT1 + `/bookCategory/add`, params);
};

// * 编辑图书类别
export const editBookCategory = (params: { id: string; versionStamp: number }) => {
	return http.post(PORT1 + `/bookCategory/update`, params, { headers: { noLoading: true } });
};

// * 删除图书类别
export const deleteBookCategory = (params: { id: string[] }) => {
	return http.post(PORT1 + `/bookCategory/delete`, params);
};

// * 切换图书类别状态
export const changeBookCategoryStatus = (params: { id: string; displayStatus: number; versionStamp: number }) => {
	return http.post(PORT1 + `/bookCategory/update`, params);
};
