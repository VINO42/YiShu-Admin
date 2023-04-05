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
			<el-form-item label="头像" prop="pic">
				<UploadImg
					v-model:imageUrl="drawerData.rowData!.pic"
					:disabled="drawerData.isView"
					:file-size="3"
					:upload-style="{ width: '150px', height: '150px' }"
					@check-validate="checkValidate('pic')"
				>
					<template #tip> 头像大小不能超过 3M </template>
				</UploadImg>
			</el-form-item>
			<el-form-item label="图书名称" prop="title">
				<el-input v-model="drawerData.rowData!.title" placeholder="请填写图书名称" clearable></el-input>
			</el-form-item>
			<el-form-item label="图书简介" prop="bookIntro">
				<el-input v-model="drawerData.rowData!.bookIntro" placeholder="请填写图书简介" clearable></el-input>
			</el-form-item>

			<el-form-item label="图书作者" prop="author">
				<el-input v-model="drawerData.rowData!.author" placeholder="请填写图书作者" clearable></el-input>
			</el-form-item>
			<el-form-item label="译者" prop="translator">
				<el-input v-model="drawerData.rowData!.translator" placeholder="请填写译者" clearable></el-input>
			</el-form-item>
			<el-form-item label="封面图" prop="pic">
				<el-input v-model="drawerData.rowData!.pic" placeholder="请填写封面图" clearable></el-input>
			</el-form-item>
			<el-form-item label="ISB码" prop="isbn">
				<el-input v-model="drawerData.rowData!.isbn" placeholder="请填写ISB码" clearable></el-input>
			</el-form-item>
			<el-form-item label="出版社" prop="publish">
				<el-input v-model="drawerData.rowData!.publish" placeholder="请填写出版社" clearable></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="drawerVisible = false">取消</el-button>
			<el-button type="primary" v-show="!drawerData.isView" @click="handleSubmit">确定</el-button>
		</template>
	</el-drawer>
</template>

<script setup lang="ts" name="BookDrawer">
import { Book } from "@/api/interface";
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import UploadImg from "@/components/UploadImg/index.vue";

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
// 公共校验方法（图片上传成功触发重新校验）
const checkValidate = (val: string) => {
	ruleFormRef.value!.validateField(val, () => {});
};
</script>
