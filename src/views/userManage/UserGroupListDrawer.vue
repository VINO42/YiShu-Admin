<template>
	<el-form-item>
		<el-drawer v-model="drawerVisible" :destroy-on-close="true" size="500px" :title="`${drawerData.title}`">
			<div style="display: inline-block; margin-left: 20px">
				<!-- <p style="margin-left: 10px">用户组列表</p> -->
				<el-select v-model="value3" multiple collapse-tags collapse-tags-tooltip placeholder="请选择" style="width: 240px">
					<el-option v-for="item in drawerData.rowData" :key="item.id" :label="item.name" :value="item.id" />
					<template #footer>
						<el-button @click="drawerVisible = false">取消</el-button>
						<el-button type="primary" v-show="!drawerData.isView" @click="handleSubmit">确定</el-button>
					</template>
				</el-select>
			</div>
		</el-drawer>
	</el-form-item>
</template>

<script setup lang="ts" name="UserGroupListDrawer">
import { UserGroup } from "@/api/interface";
import { ref } from "vue";
import { ElMessage, FormInstance, ElSelect } from "element-plus";
const value3 = ref([]);
interface DrawerProps {
	title: string;
	isView: boolean;
	rowData?: UserGroup.ResAllocateList[];
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
			ElMessage.success({ message: `${drawerData.value.title}用户成功！` });
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
