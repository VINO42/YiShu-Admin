<!-- eslint-disable vue/no-lone-template -->
<template>
	<div class="table-box">
		<ProTable
			ref="proTable"
			:columns="columns"
			:requestApi="getPermissionGroupList"
			:initParam="initParam"
			:dataCallback="dataCallback"
		>
			<template #tableHeader>
				<!-- 表格 header 按钮 -->
				<el-button type="primary" :icon="CirclePlus" @click="openDrawer('新增')" v-if="BUTTONS.add">新增权限组</el-button>

				<!-- <el-button
					type="danger"
					:icon="Delete"
					plain
					:disabled="!scope.isSelected"
					@click="batchDelete(scope.selectedListIds)"
					v-if="BUTTONS.batchDelete"
				>
					批量删除权限组
				</el-button> -->
			</template>
			<!-- Expand -->
			<template #expand="scope">
				{{ scope.row }}
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
				<el-button type="primary" link :icon="View" @click="openDrawer('查看', scope.row)">查看</el-button>
				<el-button type="primary" link :icon="EditPen" @click="openDrawer('编辑', scope.row)">编辑</el-button>
				<el-button type="primary" link :icon="EditPen" @click="openAllocateDrawer('分配权限', scope.row.id)">分配权限</el-button>

				<!-- <el-button type="primary" link :icon="Refresh" @click="resetPass(scope.row)">重置密码</el-button> -->
				<el-button type="primary" link :icon="Delete" @click="deletePermissionGroupConst(scope.row)">删除</el-button>
				<!-- <el-button type="primary" link :icon="EditPen" @click="openAllocateDrawer('分配资源', scope.row.id)">分配资源</el-button> -->
			</template>
		</ProTable>
		<PermissionGroupDrawer ref="drawerRef" />
		<AllocatePermissionDrawer ref="allocatePermissionDrawerRef" />

		<!-- <PermissionGroupResourceListDrawer ref="PermissionGroupResourceListDrawerRef" /> -->
		<ImportExcel ref="dialogRef" />
	</div>
</template>

<script setup lang="tsx" name="useComponent">
import { ref, reactive } from "vue";
// import { PermissionGroup, UserGroup } from "@/api/interface";
import { PermissionGroup } from "@/api/interface";
import { ColumnProps } from "@/components/ProTable/interface";
import { useHandleData } from "@/hooks/useHandleData";
import { useAuthButtons } from "@/hooks/useAuthButtons";
import ProTable from "@/components/YiShuProTable/index.vue";
import ImportExcel from "@/components/ImportExcel/index.vue";
import PermissionGroupDrawer from "@/views/permissionGroupManage/PermissionGroupDrawer.vue";
import AllocatePermissionDrawer from "@/views/permissionGroupManage/AllocatePermissionDrawer.vue";
// import PermissionGroupResourceListDrawer from "@/views/PermissionGroupManage/PermissionGroupResourceListDrawer.vue";
import { getUserStatus } from "@/api/modules/Common";
import { CirclePlus, Delete, EditPen, View } from "@element-plus/icons-vue";
import {
	getPermissionGroupList,
	deletePermissionGroup,
	editPermissionGroup,
	addPermissionGroup,
	changePermissionGroupStatus,
	getPermsbyGroupId,
	updatePermsGroupPerms
} from "@/api/modules/permissionGroup";
// import { getAllPermissionGroupList, getPermissionGroupPermissionGroupList, alocatPermissionGroupPermissionGroup } from "@/api/modules/user";

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
	{ prop: "permissionGroupName", label: "权限组名称", search: { el: "input" } },
	{ prop: "permissionGroupCode", label: "权限组编码", search: { el: "input" } },
	{
		prop: "displayStatus",
		label: "权限组状态",
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

// 删除权限组信息
const deletePermissionGroupConst = async (params: PermissionGroup.ResPermissionGroupList) => {
	await useHandleData(deletePermissionGroup, { id: [params.id] }, `删除【${params.permissionGroupName}】权限组`);
	proTable.value.getTableList();
};

// 重置用户密码
// const resetPass = async (params: User.ResUserList) => {
// 	await useHandleData(resetUserPassWord, { id: params.id }, `重置【${params.realName}】用户密码`);
// 	proTable.value.getTableList();
// };

// 切换用户状态
const changeStatus = async (row: PermissionGroup.ResPermissionGroupList) => {
	await useHandleData(
		changePermissionGroupStatus,
		{ id: row.id, displayStatus: row.displayStatus == 1 ? 0 : 1, versionStamp: row.versionStamp },
		`切换【${row.permissionGroupName}】权限组状态`
	);
	proTable.value.getTableList();
};
// 批量删除用户信息
// const batchDelete = async (id: string[]) => {
// 	await useHandleData(deletePermissionGroup, { id }, "删除所选权限组信息");
// 	proTable.value.clearSelection();
// 	proTable.value.getTableList();
// };
// 打开 drawer(新增、查看、编辑)
const drawerRef = ref();
const openDrawer = (title: string, rowData: Partial<PermissionGroup.ResPermissionGroupList> = { permissionGroupName: "" }) => {
	let params = {
		title,
		rowData: { ...rowData },
		isView: title === "查看",
		apiUrl: title === "新增" ? addPermissionGroup : title === "编辑" ? editPermissionGroup : "",
		getTableList: proTable.value.getTableList
	};
	drawerRef.value.acceptParams(params);
};
const allocatePermissionDrawerRef = ref();
//分配权限页面打开
const openAllocateDrawer = (title: string, groupId: number) => {
	// let v3: UserGroup.ResUserGroupRolesList[] = [];
	if (title === "分配权限") {
		getPermsbyGroupId({ groupId: groupId })
			.then(value => {
				console.log(value);
				let params = {
					title,
					groupId: groupId,
					modelData: value.data,
					isView: false,
					apiUrl: updatePermsGroupPerms,
					getTableList: proTable.value.getTableList
				};
				allocatePermissionDrawerRef.value.acceptParams(params);
			})
			.catch(err => {
				console.error(err);
			});
	}
};
</script>
