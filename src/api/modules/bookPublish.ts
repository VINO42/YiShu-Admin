import { ResPage, BookPublish } from "@/api/interface/index";
import { PORT1 } from "@/api/config/servicePort";

import http from "@/api";

/**
 * @name 图书管理模块
 */
// * 获取图书列表
export const getBookPublishList = (params: BookPublish.ReqGetBookPublishParams) => {
	return http.get<ResPage<BookPublish.ResBookPublishList>>(PORT1 + `/userPublishBookRecord/page`, params);
};
// * 新增图书
export const addBookPublish = (params: { id: string }) => {
	return http.post(PORT1 + `/userPublishBookRecord/add`, params);
};
// * 编辑图书
export const editBookPublish = (params: { id: string; versionStamp: number }) => {
	return http.post(PORT1 + `/userPublishBookRecord/update`, params, { headers: { noLoading: true } });
};

// * 删除图书
// export const deleteBookPublish = (params: { id: string[] }) => {
// 	return http.post(PORT1 + `/userPublishBookRecord/delete`, params);
// };

// * 切换图书状态
// export const changeBookPublishStatus = (params: { id: string; displayStatus: number; versionStamp: number }) => {
// 	return http.post(PORT1 + `/userPublishBookRecord/update`, params);
// };
