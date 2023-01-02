<template>
	<el-drawer v-model="drawerVisible" :destroy-on-close="true" size="500px" :title="`${drawerData.title}资源`">
		<el-form
			ref="ruleFormRef"
			:rules="rules"
			:disabled="drawerData.isView"
			:model="drawerData.rowData"
			label-width="100px"
			label-suffix=" :"
			:hide-required-asterisk="drawerData.isView"
		>
			<el-form-item label="资源名称" prop="name">
				<el-input v-model="drawerData.rowData!.name" placeholder="" clearable></el-input>
			</el-form-item>
			<el-form-item label="资源描述" prop="title">
				<el-input v-model="drawerData.rowData!.title" placeholder="" clearable></el-input>
			</el-form-item>
			<el-form-item label="资源前端路径" prop="frontPath">
				<el-input v-model="drawerData.rowData!.frontPath" placeholder="" clearable></el-input>
			</el-form-item>
			<el-form-item label="资源接口路径" prop="url">
				<el-input v-model="drawerData.rowData!.url" placeholder="=" clearable></el-input>
			</el-form-item>
			<el-form-item label="资源客户端类型" prop="platformType">
				<el-input v-model="drawerData.rowData!.platformType" placeholder="" clearable></el-input>
			</el-form-item>
			<el-form-item label="资源类型" prop="type">
				<el-input v-model="drawerData.rowData!.title" placeholder="" clearable></el-input>
			</el-form-item>
			<el-form-item label="资源级别" prop="levelCode">
				<el-input v-model="drawerData.rowData!.levelCode" placeholder="" clearable></el-input>
			</el-form-item>
			<el-form-item label="资源排序" prop="sort">
				<el-input v-model="drawerData.rowData!.sort" placeholder="" clearable></el-input>
			</el-form-item>
			<el-form-item label="资源组件" prop="component">
				<el-input v-model="drawerData.rowData!.component" placeholder="" clearable></el-input>
			</el-form-item>
			<el-form-item label="资源图标" prop="icon">
				<el-input v-model="drawerData.rowData!.icon" placeholder="" clearable></el-input>
			</el-form-item>
			<el-form-item label="是否链接" prop="isLink">
				<el-input v-model="drawerData.rowData!.isLink" placeholder="" clearable></el-input>
			</el-form-item>
			<el-form-item label="是否隐藏" prop="isHide">
				<el-input v-model="drawerData.rowData!.isHide" placeholder="" clearable></el-input>
			</el-form-item>
			<el-form-item label="是否链接前端资源" prop="isAffix">
				<el-input v-model="drawerData.rowData!.isAffix" placeholder="" clearable></el-input>
			</el-form-item>
			<el-form-item label="是否保持链接" prop="isKeepalive">
				<el-input v-model="drawerData.rowData!.isKeepalive" placeholder="" clearable></el-input>
			</el-form-item>
			<el-form-item label="是否跳转路径" prop="redirect">
				<el-input v-model="drawerData.rowData!.redirect" placeholder="" clearable></el-input>
			</el-form-item>
			<el-form-item label="是否全屏" prop="isFull">
				<el-input v-model="drawerData.rowData!.isFull" placeholder="" clearable></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="drawerVisible = false">取消</el-button>
			<el-button type="primary" v-show="!drawerData.isView" @click="handleSubmit">确定</el-button>
		</template>
	</el-drawer>
</template>

<script setup lang="ts" name="ResourceDrawer">
import { Resource } from "@/api/interface";
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";

const rules = reactive({
	permissionGroupName: [{ required: true, message: "请填写资源名称", trigger: "change" }]
});

interface DrawerProps {
	title: string;
	isView: boolean;
	rowData?: Resource.ResResourceList;
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
			ElMessage.success({ message: `${drawerData.value.title}资源成功！` });
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
