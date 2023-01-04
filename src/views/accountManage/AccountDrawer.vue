<template>
	<el-drawer v-model="drawerVisible" :destroy-on-close="true" size="500px" :title="`${drawerData.title}用户`">
		<el-form
			ref="ruleFormRef"
			:rules="rules"
			:disabled="drawerData.isView"
			:model="drawerData.rowData"
			label-width="100px"
			label-suffix=" :"
			:hide-required-asterisk="drawerData.isView"
		>
			<el-form-item label="头像" prop="avatar">
				<UploadImg
					v-model:imageUrl="drawerData.rowData!.avatar"
					:disabled="drawerData.isView"
					:file-size="3"
					:upload-style="{ width: '150px', height: '150px' }"
					@check-validate="checkValidate('avatar')"
				>
					<template #tip> 头像大小不能超过 3M </template>
				</UploadImg>
			</el-form-item>
			<el-form-item label="账号手机号" prop="mobile">
				<el-input v-model="drawerData.rowData!.mobile" placeholder="账号手机号" clearable></el-input>
			</el-form-item>
			<el-form-item label="UnionId" prop="unionId">
				<el-input v-model="drawerData.rowData!.unionId" placeholder="小程序UnionId" clearable></el-input>
			</el-form-item>
			<el-form-item label="昵称" prop="nickName">
				<el-input v-model="drawerData.rowData!.nickName" placeholder="请填写昵称" clearable></el-input>
			</el-form-item>
			<el-form-item label="密码" prop="passwd">
				<el-input v-model="drawerData.rowData!.passwd" placeholder="请填写密码" clearable></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="drawerVisible = false">取消</el-button>
			<el-button type="primary" v-show="!drawerData.isView" @click="handleSubmit">确定</el-button>
		</template>
	</el-drawer>
</template>

<script setup lang="ts" name="AccountDrawer">
import { Account } from "@/api/interface";
import { ref, reactive } from "vue";
import { ElMessage, FormInstance } from "element-plus";
import UploadImg from "@/components/UploadImg/index.vue";

const rules = reactive({
	// avatar: [{ required: false, message: "请上传用户头像", trigger: "change" }],
	mobile: [{ required: true, message: "请填写账号手机号", trigger: "change" }],
	unionId: [{ required: false, message: "请填写小程序唯一UnionId", trigger: "change" }],
	nickName: [{ required: true, message: "请填写昵称", trigger: "change" }],
	passwd: [{ required: true, message: "请填写密码", trigger: "change" }]
});

interface DrawerProps {
	title: string;
	isView: boolean;
	rowData?: Account.ResAccountList;
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

// 公共校验方法（图片上传成功触发重新校验）
const checkValidate = (val: string) => {
	ruleFormRef.value!.validateField(val, () => {});
};

defineExpose({
	acceptParams
});
</script>
