<template>
	<el-drawer
		:close-on-press-escape="true"
		v-model="drawerVisible"
		:destroy-on-close="true"
		size="500px"
		:title="`${drawerData.title}`"
	>
		<div class="main-box">
			<el-scrollbar style="height: 100%">
				<!-- <TreeFilter
			label="name"
			title="部门列表(单选)"
			:data="treeFilterData"
			:defaultValue="initParam.resourceId"
			@change="changeTreeFilter"
		/>-->
				<el-tree
					ref="myTree"
					:data="treeFilterData1"
					show-checkbox
					default-expand-all
					node-key="id"
					highlight-current
					:props="defaultProps"
					:default-checked-keys="checkedData"
					@check-change="handleCheckChange"
				/>
			</el-scrollbar>
		</div>
		<template #footer>
			<el-button @click="drawerVisible = false">取消</el-button>
			<el-button type="primary" v-show="!drawerData.isView" @click="handleSubmit">确定</el-button>
		</template>
	</el-drawer>
</template>

<script setup lang="ts" name="AllocatePermissionDrawer">
import { onMounted, ref } from "vue";
import { ElTree, ElMessage, ElScrollbar } from "element-plus";
//updatePermsGroupPerms
import { getAllPerms, getPermsbyGroupId } from "@/api/modules/permissionGroup";

onMounted(() => {
	getTreeFilter1();
	// checkedDataHandler();
});
// const value3 = ref([]);
interface DrawerProps {
	title: string;
	modelData?: number[];
	isView: boolean;
	groupId: number;
	apiUrl?: (params: any) => Promise<any>;
	getTableList?: () => Promise<any>;
}
// drawer框状态
const drawerVisible = ref(false);
const drawerData = ref<DrawerProps>({
	isView: false,
	groupId: -1,
	title: ""
});
const defaultProps = {
	children: "children",
	label: "label",
	permId: "permId",
	id: "id"
};

const checkedData = ref<any>([]);

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps): void => {
	drawerData.value = params;
	drawerVisible.value = true;
	checkedDataHandler();
};
const checkedDataHandler = async () => {
	arr.length = 0;

	checkedData.value = [];
	let groupId = drawerData.value.groupId;
	const data1 = await getPermsbyGroupId({ groupId });
	checkedData.value = data1.data;
};

interface Tree {
	id: number;
	label: string;
	children: Tree[];
	permId: number;
}
let arr = new Array<number>();
drawerData.value.modelData?.forEach(item => {
	arr.push(item);
});
const handleCheckChange = (data: Tree, checked: boolean, indeterminate: boolean) => {
	if (checked) {
		//添加
		arr.push(data.permId);
	} else {
		//移除
		for (let i: number = 0; i < arr.length; i++) {
			console.log(arr[i]);
			if (arr[i] == data.permId) {
				arr.splice(i, 1);
			}
		}
	}
	console.log(data, checked, indeterminate);
};

const treeFilterData1 = ref<any>([]);
const getTreeFilter1 = async () => {
	arr.length = 0;
	treeFilterData1.value = [];
	const data1 = await getAllPerms();
	treeFilterData1.value = data1.data;
};

const handleSubmit = async () => {
	try {
		let paramsIds = [...new Set(arr)];
		let params = { groupId: drawerData.value.groupId, ids: paramsIds };
		console.log(params);
		await drawerData.value.apiUrl!(params);
		ElMessage.success({ message: `${drawerData.value.title}成功！` });
		drawerVisible.value = false;
		drawerData.value.getTableList!();
	} catch (error) {
		console.log(error);
	}
};
defineExpose({
	acceptParams
});
</script>
