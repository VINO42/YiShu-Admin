import { ResPage, Book } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";

import http from "@/api";

/**
 * @name 图书管理模块
 */
// * 获取图书列表
export const getBookList = (params: Book.ReqGetBookParams) => {
	return http.get<ResPage<Book.ResBookList>>(PORT1 + `/book/page`, params);
};

// * 新增图书
export const addBook = (params: { id: string }) => {
	return http.post(PORT1 + `/book/add`, params);
};

// * 编辑图书
export const editBook = (params: { id: string }) => {
	return http.post(PORT1 + `/book/update`, params, { headers: { noLoading: true } });
};

// * 删除图书
export const deleteBook = (params: { id: string[] }) => {
	return http.post(PORT1 + `/book/delete`, params);
};

// * 切换图书状态
export const changeBookStatus = (params: { id: string; displayStatus: number }) => {
	return http.post(PORT1 + `/book/update`, params);
};

// * 获取所有的图书分类列表
export const getAllCategories = () => {
	return http.get<Book.ResAllocateList[]>(PORT1 + `/bookCategory/getAllCategories`, {
		headers: { noLoading: true }
	});
};
// * 获取某个图书的图书分类信息
export const getBookCategorisByBookId = (params: { userId: string }) => {
	return http.get<Book.ResBookCategoryList[]>(PORT1 + `/bookCategory/getBookCategorisByBookId`, params, {
		headers: { noLoading: true }
	});
};

// * 分配图书类别
export const alocateBookBookCategory = (params: { id: string }) => {
	return http.post(PORT1 + `/book/alocateBookBookCategory`, params, { headers: { noLoading: true } });
};
