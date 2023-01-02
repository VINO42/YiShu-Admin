<template>
	<el-drawer v-model="drawerVisible" :destroy-on-close="true" size="500px" :title="`${drawerData.title}图书`">
		<el-form
			ref="ruleFormRef"
			:rules="rules"
			:disabled="drawerData.isView"
			:model="drawerData.rowData"
			label-width="100px"
			label-suffix=" :"
			:hide-required-asterisk="drawerData.isView"
		>
			<el-form-item label="图书名称" prop="title">
				<el-input v-model="drawerData.rowData!.title" placeholder="" clearable></el-input>
			</el-form-item>
			<el-form-item label="图书简介" prop="bookIntro">
				<el-input v-model="drawerData.rowData!.bookIntro" placeholder="" clearable></el-input>
			</el-form-item>

			<el-form-item label="图书作者" prop="author">
				<el-input v-model="drawerData.rowData!.author" placeholder="" clearable></el-input>
			</el-form-item>
			<el-form-item label="译者" prop="translator">
				<el-input v-model="drawerData.rowData!.translator" placeholder="" clearable></el-input>
			</el-form-item>
			<el-form-item label="封面图" prop="pic">
				<el-input v-model="drawerData.rowData!.pic" placeholder="" clearable></el-input>
			</el-form-item>
			<el-form-item label="ISB码" prop="isbn">
				<el-input v-model="drawerData.rowData!.isbn" placeholder="" clearable></el-input>
			</el-form-item>
			<el-form-item label="出版社" prop="publish">
				<el-input v-model="drawerData.rowData!.publish" placeholder="" clearable></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="drawerVisible = false">取消</el-button>
			<el-button type="primary" v-show="!drawerData.isView" @click="handleSubmit">确定</el-button>
		</template>
	</el-drawer>
</template>

<script setup lang="ts" name="BookViewDrawer">
import { Book } from "@/api/interface";
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";

const rules = reactive({
	title: [{ required: true, message: "请填写图书名称", trigger: "change" }],
	author: [{ required: true, message: "请填写作者", trigger: "change" }]
});

interface DrawerProps {
	title: string;
	isView: boolean;
	rowData?: Book.ResBookList;
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
