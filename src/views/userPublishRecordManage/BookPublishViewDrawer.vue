<template>
	<el-drawer v-model="drawerVisible" :destroy-on-close="true" size="500px" :title="`${drawerData.title}发布`">
		<el-form
			ref="ruleFormRef"
			:disabled="drawerData.isView"
			:model="drawerData.rowData"
			label-width="100px"
			label-suffix=" :"
			:hide-required-asterisk="drawerData.isView"
		>
			<el-form-item label="头像" prop="avatar">
				<el-image
					style="width: 100px; height: 100px"
					:src="drawerData.rowData!.avatar"
					:preview-src-list="[drawerData.rowData!.avatar]"
					:initial-index="0"
					fit="cover"
				/>
			</el-form-item>

			<el-form-item label="用户昵称" prop="nickName">
				<el-input v-model="drawerData.rowData!.nickName" placeholder="" clearable></el-input>
			</el-form-item>
			<el-form-item label="UnionId" prop="unionId">
				<el-input v-model="drawerData.rowData!.unionId" placeholder="" clearable></el-input>
			</el-form-item>
			<el-form-item label="图书id" prop="bookId">
				<el-input v-model="drawerData.rowData!.bookId" placeholder="" clearable></el-input>
			</el-form-item>
			<el-form-item label="图书名称" prop="title">
				<el-input v-model="drawerData.rowData!.title" placeholder="" clearable></el-input>
			</el-form-item>
			<el-form-item label="图书封面" prop="pic">
				<el-image
					style="width: 100px; height: 100px"
					:src="drawerData.rowData!.pic"
					:preview-src-list="[drawerData.rowData!.pic]"
					:initial-index="0"
					fit="cover"
				/>
			</el-form-item>

			<el-form-item label="ISB码" prop="isbn">
				<el-input v-model="drawerData.rowData!.isbn" placeholder="" clearable></el-input>
			</el-form-item>
			<el-form-item label="联系方式" prop="contract">
				<el-input v-model="drawerData.rowData!.contract" placeholder="" clearable></el-input>
			</el-form-item>

			<el-form-item label="备注信息" prop="remark">
				<el-input v-model="drawerData.rowData!.remark" placeholder="" clearable></el-input>
			</el-form-item>
			<el-form-item label="发布时间" prop="publishDate">
				<el-input v-model="drawerData.rowData!.publishDate" placeholder="" clearable></el-input>
			</el-form-item>
		</el-form>
		<template #footer>
			<el-button @click="drawerVisible = false">取消</el-button>
			<el-button type="primary" v-show="!drawerData.isView" @click="handleSubmit">确定</el-button>
		</template>
	</el-drawer>
</template>

<script setup lang="ts" name="BookPublishViewDrawer">
import { BookPublish } from "@/api/interface";
import { ref } from "vue";
import { ElMessage, FormInstance } from "element-plus";

interface DrawerProps {
	title: string;
	isView: boolean;
	rowData?: BookPublish.ResBookPublishList;
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
			ElMessage.success({ message: `${drawerData.value.title}发布记录成功！` });
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
