<template>
	<el-drawer v-model="drawerVisible" :destroy-on-close="true" size="500px" :title="`${drawerData.title}图书类别`">
		<el-form
			ref="ruleFormRef"
			:rules="rules"
			:disabled="drawerData.isView"
			:model="drawerData.rowData"
			label-width="100px"
			label-suffix=" :"
			:hide-required-asterisk="drawerData.isView"
		>
			<el-form-item label="图书类别名称" prop="categoryName">
				<el-input v-model="drawerData.rowData!.categoryName" placeholder="请填写图书类别名称" clearable></el-input>
			</el-form-item>
			<el-form-item label="图书类别编码" prop="categoryCode">
				<el-input v-model="drawerData.rowData!.categoryCode" placeholder="请填写图书类别编码" clearable></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="drawerVisible = false">取消</el-button>
			<el-button type="primary" v-show="!drawerData.isView" @click="handleSubmit">确定</el-button>
		</template>
	</el-drawer>
</template>

<script setup lang="ts" name="BookCategoryDrawer">
import { BookCategory } from "@/api/interface";
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";

const rules = reactive({
	userGroupName: [{ required: true, message: "请填写图书类别名称", trigger: "change" }],
	userGroupCode: [{ required: true, message: "请填写图书类别编码", trigger: "change" }]
});

interface DrawerProps {
	title: string;
	isView: boolean;
	rowData?: BookCategory.ResBookCategoryList;
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
			ElMessage.success({ message: `${drawerData.value.title}用户组成功！` });
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
