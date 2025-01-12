<template>
	<div class="table-box">
		<ProTable ref="proTable" :columns="columns" :requestApi="getAccountList" :initParam="initParam" :dataCallback="dataCallback">
			<!-- 表格 header 按钮  #tableHeader="scope"-->
			<template #tableHeader>
				<el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')" v-if="BUTTONS.add">新增后台账号</el-button>
				<!-- <el-button type="primary" :icon="Upload" plain @click="batchAdd" v-if="BUTTONS.batchAdd">批量添加账号</el-button> -->
				<!-- <el-button type="primary" :icon="Download" plain @click="downloadFile" v-if="BUTTONS.export">导出账号数据</el-button> -->
				<!-- <el-button
					type="danger"
					:icon="Delete"
					plain
					:disabled="!scope.isSelected"
					@click="batchDelete(scope.selectedListIds)"
					v-if="BUTTONS.batchDelete"
				>
					批量删除账号
				</el-button> -->
			</template>
			<!-- Expand -->
			<template #expand="scope">
				{{ scope.row }}
			</template>
			<!-- 头像 slot -->
			<template #avatar="scope">
				<el-image
					style="width: 50px; height: 50px"
					lazy
					:src="scope.row.avatar"
					:preview-src-list="[scope.row.avatar]"
					:initial-index="0"
					fit="contain"
				/>
			</template>
			<!-- 账号状态 slot -->
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
				<el-button type="primary" link :icon="Delete" @click="deleteAccountInfo(scope.row)">删除</el-button>
			</template>
		</ProTable>
		<AccountDrawer ref="drawerRef" />
		<AccountViewDrawer ref="accountViewDrawer" />

		<ImportExcel ref="dialogRef" />
	</div>
</template>

<script setup lang="tsx" name="useComponent">
import { ref, reactive } from "vue";
import { Account } from "@/api/interface";
import { ColumnProps } from "@/components/ProTable/interface";
import { useHandleData } from "@/hooks/useHandleData";
// import { useDownload } from "@/hooks/useDownload";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import ProTable from "@/components/YiShuProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import AccountDrawer from "@/views/accountManage/AccountDrawer.vue";
import AccountViewDrawer from "@/views/accountManage/AccountViewDrawer.vue";

import { CirclePlus, Delete, EditPen, View } from "@element-plus/icons-vue";
import {
	getAccountList,
	deleteAccount,
	editAccount,
	addAccount,
	changeAccountStatus
	// resetAccountPassWord
	// exportAccountInfo,
	// BatchAddAccount
} from "@/api/modules/account";
import { getUserStatus, getAccountTypeEnum } from "@/api/modules/Common";

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

// 表格配置项
const columns: Partial<ColumnProps>[] = [
	{ type: "selection", width: 80, fixed: "left" },
	{ type: "index", label: "#", width: 80 },
	{ type: "expand", label: "Expand", width: 100 },
	// 😄 enum 可以直接是数组对象，也可以是请求方法(proTable 内部会执行获取 enum 的这个方法)，下面账号状态也同理
	// 😄 enum 为请求方法时，后台返回的数组对象 key 值不是 label 和 value 的情况，可以在 searchProps 中指定 label 和 value 的 key 值
	{ prop: "mobile", label: "手机号", search: { el: "input" } },
	{ prop: "unionId", label: "unionId", search: { el: "input" } },
	{ prop: "avatar", label: "头像" },

	{
		prop: "accountType",
		label: "账号类型",
		sortable: true,
		search: { el: "select" },
		enum: getAccountTypeEnum,
		fieldNames: { label: "description", value: "value" }
	},
	{
		prop: "displayStatus",
		label: "账号状态",
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

// 删除账号信息
const deleteAccountInfo = async (params: Account.ResAccountList) => {
	await useHandleData(deleteAccount, { id: [params.id] }, `删除【${params.mobile}】账号`);
	proTable.value.getTableList();
};

// 批量删除账号信息
// const batchDelete = async (id: string[]) => {
// 	await useHandleData(deleteAccount, { id }, "删除所选账号信息");
// 	proTable.value.clearSelection();
// 	proTable.value.getTableList();
// };

// 重置账号密码
// const resetPass = async (params: Account.ResAccountList) => {
// 	await useHandleData(resetAccountPassWord, { id: params.id }, `重置【${params.mobile}】账号密码`);
// 	proTable.value.getTableList();
// };

// 切换账号状态
const changeStatus = async (row: Account.ResAccountList) => {
	await useHandleData(
		changeAccountStatus,
		{ id: row.id, displayStatus: row.displayStatus == 1 ? 0 : 1, versionStamp: row.versionStamp },
		`切换【${row.mobile}】账号状态`
	);
	proTable.value.getTableList();
};

// 导出账号列表
// const downloadFile = async () => {
// 	useDownload(exportAccountInfo, "账号列表", proTable.value.searchParam);
// };

// 批量添加账号
const dialogRef = ref();
// const batchAdd = () => {
// 	let params = {
// 		title: "账号",
// 		tempApi: exportAccountInfo,
// 		importApi: BatchAddAccount,
// 		getTableList: proTable.value.getTableList
// 	};
// 	dialogRef.value.acceptParams(params);
// };

// 打开 drawer(新增、查看、编辑)
const drawerRef = ref();
const openDrawer = (title: string, rowData: Partial<Account.ResAccountList> = {}) => {
	let params = {
		title,
		rowData: { ...rowData },
		isView: title === "查看",
		apiUrl: title === "新增" ? addAccount : title === "编辑" ? editAccount : "",
		getTableList: proTable.value.getTableList
	};
	drawerRef.value.acceptParams(params);
};
const accountViewDrawer = ref();
const openViewDrawer = (title: string, rowData: Partial<Account.ResAccountList> = { avatar: "" }) => {
	let params = {
		title,
		rowData: { ...rowData },
		isView: title === "查看",
		apiUrl: title === "新增" ? addAccount : title === "编辑" ? editAccount : "",
		getTableList: proTable.value.getTableList
	};
	accountViewDrawer.value.acceptParams(params);
};
</script>
