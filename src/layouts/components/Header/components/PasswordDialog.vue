<template>
	<el-dialog v-model="dialogVisible" title="修改密码" width="500px" draggable>
		<el-form ref="updatePasswdFormRef" :model="drawerData" :rules="rules">
			<el-form-item label="旧密码" prop="oldPassword">
				<el-input v-model="drawerData.oldPasswd" placeholder="旧密码" clearable></el-input>
			</el-form-item>
			<el-form-item label="新密码" prop="newPassword">
				<el-input v-model="drawerData.newPasswd" placeholder="新密码" clearable></el-input>
			</el-form-item>
		</el-form>

		<template #footer>
			<span class="dialog-footer">
				<el-button @click="dialogVisible = false">取消</el-button>
				<!-- <el-button type="primary" @click="dialogVisible = false">确认</el-button> -->
				<el-button type="primary" @click="handleSubmit">确认</el-button>
			</span>
		</template>
	</el-dialog>
</template>

<script setup lang="ts">
import { ref, reactive } from "vue";
import { updatePassword } from "@/api/modules/common";
import { ElMessage, FormInstance } from "element-plus";
import { GlobalStore } from "@/stores";
import md5 from "js-md5";
import { LOGIN_URL } from "@/config/config";
import { useRouter } from "vue-router";
const updatePasswdFormRef = ref<FormInstance>();
const globalStore = GlobalStore();

const dialogVisible = ref(false);
const rules = reactive({
	oldPasswd: [{ required: true, message: "请输入旧密码", trigger: "change" }],
	newPasswd: [{ required: true, message: "请输入新密码", trigger: "change" }]
});
interface DrawerProps {
	oldPasswd: string;
	newPasswd: string;
}
const drawerData = ref<DrawerProps>({
	oldPasswd: "",
	newPasswd: ""
});

// openDialog
const openDialog = () => {
	dialogVisible.value = true;
	drawerData.value.oldPasswd = "";
	drawerData.value.newPasswd = "";
};
const router = useRouter();

const handleSubmit = () => {
	updatePasswdFormRef.value!.validate(async valid => {
		if (!valid) return;
		try {
			let data = globalStore.accountId;
			let params: any = {
				oldPassword: md5(drawerData.value?.oldPasswd),
				newPassword: md5(drawerData.value?.newPasswd),
				accountId: data
			};

			await updatePassword(params);

			ElMessage.success({ message: `修改密码成功! 请重新登录` });
			globalStore.setToken("");
			globalStore.setAccountId(0);
			globalStore.setUserInfo(undefined);
			router.replace(LOGIN_URL);
			// ElNotification({
			// 	title: getTimeState(),
			// 	message: "欢迎登录 YiShu-Admin",
			// 	type: "success",
			// 	duration: 3000
			// });
		} catch (error) {
			console.log(error);
		}
	});
};

defineExpose({ openDialog });
</script>
