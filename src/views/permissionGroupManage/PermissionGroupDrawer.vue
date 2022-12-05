<template>
	<el-drawer v-model="drawerVisible" :destroy-on-close="true" size="500px" :title="`${drawerData.title}角色`">
		<el-form
			ref="ruleFormRef"
			:rules="rules"
			:disabled="drawerData.isView"
			:model="drawerData.rowData"
			label-width="100px"
			label-suffix=" :"
			:hide-required-asterisk="drawerData.isView"
		>
			<el-form-item label="权限组名称" prop="permissionGroupName">
				<el-input v-model="drawerData.rowData!.permissionGroupName" placeholder="请填写权限组名称" clearable></el-input>
			</el-form-item>
			<el-form-item label="权限组编码" prop="permissionGroupCode">
				<el-input v-model="drawerData.rowData!.permissionGroupCode" placeholder="请填写权限组编码" clearable></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="drawerVisible = false">取消</el-button>
			<el-button type="primary" v-show="!drawerData.isView" @click="handleSubmit">确定</el-button>
		</template>
	</el-drawer>
</template>

<script setup lang="ts" name="PermissionGroupDrawer">
import { PermissionGroup } from "@/api/interface";
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";

const rules = reactive({
	permissionGroupName: [{ required: true, message: "请填写权限组名称", trigger: "change" }],
	permissionGroupCode: [{ required: true, message: "请填写权限组编码", trigger: "change" }]
});

interface DrawerProps {
	title: string;
	isView: boolean;
	rowData?: PermissionGroup.ResPermissionGroupList;
	apiUrl?: (params: any) => Promise<any>;
	getTableList?: () => Promise<any>;
}

// drawer框状态
const drawerVisible = ref(false);
const drawerData = ref<DrawerProps>({
	isView: false,
	title: ""
});

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps): void => {
	drawerData.value = params;
	drawerVisible.value = true;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();
const handleSubmit = () => {
	ruleFormRef.value!.validate(async valid => {
		if (!valid) return;
		try {
			await drawerData.value.apiUrl!(drawerData.value.rowData);
			ElMessage.success({ message: `${drawerData.value.title}权限组成功！` });
			drawerData.value.getTableList!();
			drawerVisible.value = false;
		} catch (error) {
			console.log(error);
		}
	});
};

defineExpose({
	acceptParams
});
</script>
