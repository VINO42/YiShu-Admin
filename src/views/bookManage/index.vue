<!-- eslint-disable vue/no-lone-template -->
<template>
	<div class="table-box">
		<ProTable ref="proTable" :columns="columns" :requestApi="getBookList" :initParam="initParam" :dataCallback="dataCallback">
			<template #tableHeader>
				<!-- 表格 header 按钮 -->
				<el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')" v-if="BUTTONS.add">新增图书</el-button>
				<!-- <el-button
					type="danger"
					:icon="Delete"
					plain
					:disabled="!scope.isSelected"
					@click="batchDelete(scope.selectedListIds)"
					v-if="BUTTONS.batchDelete"
				>
					批量删除图书
				</el-button> -->
			</template>
			<!-- Expand -->
			<template #expand="scope">
				{{ scope.row }}
			</template>
			<template #pic="scope">
				<el-image
					style="width: 50px; height: 50px"
					lazy
					:src="scope.row.pic"
					:preview-src-list="[scope.row.pic]"
					:initial-index="0"
					fit="contain"
				/>
			</template>
			<!-- 用户状态 slot -->
			<template #displayStatus="scope">
				<!-- 如果插槽的值为 el-switch，第一次加载会默认触发 switch 的 @change 方法，所以使用 click 方法（暂时只能这样解决） -->
				<el-switch
					:model-value="scope.row.displayStatus"
					:active-text="scope.row.displayStatus === 1 ? '启用' : scope.row.displayStatus == 2 ? '删除' : '禁用'"
					:active-value="1"
					:inactive-value="0"
					@click="changeStatus(scope.row)"
					v-if="BUTTONS.status"
				/>
				<el-tag :type="scope.row.displayStatus === 1 ? 'success' : 'danger'" v-else>
					{{ scope.row.displayStatus === 1 ? "启用" : scope.row.displayStatus == 2 ? "删除" : "禁用" }}
				</el-tag>
			</template>
			<!-- 表格操作 -->
			<template #operation="scope">
				<el-button type="primary" link :icon="View" @click="openViewDrawer('查看', scope.row)">查看</el-button>
				<el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
				<!-- <el-button type="primary" link :icon="Refresh" @click="resetPass(scope.row)">重置密码</el-button> -->
				<el-button type="primary" link :icon="EditPen" @click="openAllocateDrawer('分配图书类别', scope.row.id)"
					>分配图书类别</el-button
				>
				<el-button type="primary" link :icon="Delete" @click="deleteBookConst(scope.row)">删除</el-button>
			</template>
		</ProTable>
		<BookDrawer ref="drawerRef" />
		<BookViewDrawer ref="bookViewDrawer" />

		<BookBookCategoryDrawer ref="bookBookCategoryDrawer" />
		<!-- <ImportExcel ref="dialogRef" /> -->
	</div>
</template>

<script setup lang="tsx" name="useComponent">
import { ref, reactive } from "vue";
import { Book } from "@/api/interface";
import { ColumnProps } from "@/components/ProTable/interface";
import { useHandleData } from "@/hooks/useHandleData";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import ProTable from "@/components/YiShuProTable/index.vue";
// import ImportExcel from "@/components/ImportExcel/index.vue";
import BookDrawer from "@/views/bookManage/BookDrawer.vue";
import BookViewDrawer from "@/views/bookManage/BookViewDrawer.vue";
import BookBookCategoryDrawer from "@/views/bookManage/BookBookCategoryDrawer.vue";
import { getUserStatus } from "@/api/modules/common";
import { CirclePlus, Delete, EditPen, View } from "@element-plus/icons-vue";
import {
	getBookList,
	deleteBook,
	editBook,
	addBook,
	changeBookStatus,
	getAllCategories,
	alocateBookBookCategory,
	getBookCategorisByBookId
} from "@/api/modules/book";

// 获取 ProTable 元素，调用其获取刷新数据方法（还能获取到当前查询参数，方便导出携带参数）
const proTable = ref();

// 如果表格需要初始化请求参数，直接定义传给 ProTable(之后每次请求都会自动带上该参数，此参数更改之后也会一直带上，改变此参数会自动刷新表格数据)
const initParam = reactive({
	type: 1
});

// dataCallback 是对于返回的表格数据做处理，如果你后台返回的数据不是 records && total && current && size 这些字段，那么你可以在这里进行处理成这些字段
const dataCallback = (data: any) => {
	return {
		records: data.records,
		total: data.total,
		current: data.current,
		size: data.size
	};
};

// 页面按钮权限
const { BUTTONS } = useAuthButtons();

// 自定义渲染头部(使用tsx语法)

// 表格配置项
const columns: Partial<ColumnProps>[] = [
	{ type: "selection", width: 80, fixed: "left" },
	{ type: "index", label: "#", width: 80 },
	{ type: "expand", label: "Expand", width: 100 },
	// 😄 enum 可以直接是数组对象，也可以是请求方法(proTable 内部会执行获取 enum 的这个方法)，下面用户状态也同理
	// 😄 enum 为请求方法时，后台返回的数组对象 key 值不是 label 和 value 的情况，可以在 searchProps 中指定 label 和 value 的 key 值
	{ prop: "pic", label: "封面图" },
	{ prop: "title", label: "图书名称", search: { el: "input" } },
	{ prop: "bookIntro", label: "图书简介" },
	{ prop: "author", label: "作者", search: { el: "input" } },
	{ prop: "translator", label: "译者" },
	{ prop: "isbn", label: "ISBN码" },
	{ prop: "publish", label: "出版社" },
	{ prop: "doubanUrl", label: "豆瓣地址" },

	{
		prop: "displayStatus",
		label: "数据状态",
		sortable: true,
		search: { el: "select" },
		enum: getUserStatus,
		fieldNames: { label: "desc", value: "status" }
	},
	{
		prop: "createTime",
		label: "创建时间",
		width: 200,
		sortable: true
		// search: true,
		// searchType: "datetimerange",
		// searchProps: {
		// 	disabledDate: (time: Date) => time.getTime() < Date.now() - 8.64e7
		// },
		// searchInitParam: ["2022-09-30 00:00:00", "2022-09-20 23:59:59"]
	},
	{
		prop: "updateTime",
		label: "更新时间",
		width: 200,
		sortable: true
		// search: true,
		// searchType: "datetimerange",
		// searchProps: {
		// 	disabledDate: (time: Date) => time.getTime() < Date.now() - 8.64e7
		// },
		// searchInitParam: ["2022-09-30 00:00:00", "2022-09-20 23:59:59"]
	},
	{ prop: "operation", label: "操作", width: 330, fixed: "right" }
];

// 删除图书信息
const deleteBookConst = async (params: Book.ResBookList) => {
	await useHandleData(deleteBook, { id: [params.id] }, `删除【${params.title}】图书`);
	proTable.value.getTableList();
};

// 重置用户密码
// const resetPass = async (params: User.ResUserList) => {
// 	await useHandleData(resetUserPassWord, { id: params.id }, `重置【${params.realName}】用户密码`);
// 	proTable.value.getTableList();
// };

// 切换用户状态
const changeStatus = async (row: Book.ResBookList) => {
	await useHandleData(
		changeBookStatus,
		{ id: row.id, displayStatus: row.displayStatus == 1 ? 0 : 1, versionStamp: row.versionStamp },
		`切换【${row.title}】图书状态`
	);
	proTable.value.getTableList();
};
// 批量删除用户信息
// const batchDelete = async (id: string[]) => {
// 	await useHandleData(deleteBook, { id }, "删除所选图书信息");
// 	proTable.value.clearSelection();
// 	proTable.value.getTableList();
// };
const bookBookCategoryDrawer = ref();

let v1: Book.ResAllocateList[] = [];
getAllCategories()
	.then(value => {
		console.log(value.data);
		v1 = value.data;
	})
	.catch(err => {
		console.error(err);
	});
const openAllocateDrawer = (title: string, userId: string) => {
	// let v3: Book.ResBookRolesList[] = [];
	if (title === "分配图书类别") {
		getBookCategorisByBookId({ userId: userId })
			.then(value => {
				let params = {
					title,
					userId,
					modelData: value.data,
					rowData: v1,
					apiUrl: alocateBookBookCategory,
					getTableList: proTable.value.getTableList
				};
				bookBookCategoryDrawer.value.acceptParams(params);
			})
			.catch(err => {
				console.error(err);
			});
	}
};
// 打开 drawer(新增、查看、编辑)
const drawerRef = ref();
const openDrawer = (title: string, rowData: Partial<Book.ResBookList> = { title: "" }) => {
	let params = {
		title,
		rowData: { ...rowData },
		isView: title === "查看",
		apiUrl: title === "新增" ? addBook : title === "编辑" ? editBook : "",
		getTableList: proTable.value.getTableList
	};
	drawerRef.value.acceptParams(params);
};
const bookViewDrawer = ref();
const openViewDrawer = (title: string, rowData: Partial<Book.ResBookList> = { title: "" }) => {
	let params = {
		title,
		rowData: { ...rowData },
		isView: title === "查看",
		apiUrl: title === "新增" ? addBook : title === "编辑" ? editBook : "",
		getTableList: proTable.value.getTableList
	};
	bookViewDrawer.value.acceptParams(params);
};
</script>
