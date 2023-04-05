<template>
	<el-drawer v-model="drawerVisible" :destroy-on-close="true" size="500px" :title="`${drawerData.title}`">
		<el-form
			ref="ruleFormRef"
			:disabled="drawerData.isView"
			label-width="100px"
			label-suffix=" :"
			:hide-required-asterisk="drawerData.isView"
		>
			<el-form-item prop="ids">
				<div style="display: inline-block; margin-left: 20px">
					<!-- <p style="margin-left: 10px">用户组列表</p> -->
					<el-select
						v-model="drawerData.modelData"
						multiple
						collapse-tags
						collapse-tags-tooltip
						placeholder="请选择"
						style="width: 240px"
						:destroy-on-close="true"
					>
						<el-option
							v-for="item in drawerData.rowData"
							:key="item.id"
							:label="item.name"
							:value="item.id"
							:destroy-on-close="true"
						/>
					</el-select>
				</div>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="drawerVisible = false">取消</el-button>
			<el-button type="primary" v-show="!drawerData.isView" @click="handleSubmit">确定</el-button>
		</template>
	</el-drawer>
</template>

<script setup lang="ts" name="UserGroupListDrawer">
import { UserGroup } from "@/api/interface";
import { ref } from "vue";
import { ElMessage, FormInstance, ElSelect } from "element-plus";
// const value3 = ref([]);
interface DrawerProps {
	title: string;
	userId: string;
	modelData?: UserGroup.ResUserGroupRolesList[];
	isView: boolean;
	rowData?: UserGroup.ResAllocateList[];
	apiUrl?: (params: any) => Promise<any>;
	getTableList?: () => Promise<any>;
}
// drawer框状态
const drawerVisible = ref(false);
const drawerData = ref<DrawerProps>({
	isView: false,
	userId: "",
	title: ""
});

// 接收父组件传过来的参数
const acceptParams = (params: DrawerProps): void => {
	drawerData.value = params;
	drawerVisible.value = true;
};

// 提交数据（新增/编辑）
const ruleFormRef = ref<FormInstance>();

const handleSubmit = async () => {
	try {
		let params = { userId: drawerData.value.userId, ids: drawerData.value.modelData };
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
