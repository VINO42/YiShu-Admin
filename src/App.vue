<template>
	<el-config-provider :locale="i18nLocale" :button="config" :size="assemblySize">
		<router-view> </router-view>
		<div class="footer flx-center">
			<a target="_blank" style="color: #0033cc" href="https://beian.miit.gov.cn/">京ICP备2023000447号</a>
			&nbsp; <h style="color: #5c6b77">©2023-至今 YiShu-Admin By</h> &nbsp;<a
				style="color: #0033cc"
				href="https://github.com/HalseySpicy"
				target="_blank"
				>Geeker Technology</a
			>
			&nbsp; <h style="color: #5c6b77">&</h> &nbsp;
			<a style="color: #0033cc" href="https://github.com/vino42" target="_blank">Vino42</a>
			&nbsp;&nbsp; <h style="color: #5c6b77">北邮网院毕业设计作品</h>
		</div>
	</el-config-provider>
</template>

<script setup lang="ts">
import { reactive, computed } from "vue";
import { GlobalStore } from "@/stores";
import { useTheme } from "@/hooks/useTheme";
import { getBrowserLang } from "@/utils/util";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import en from "element-plus/es/locale/lang/en";

// 使用主题
useTheme();

const globalStore = GlobalStore();
// 配置element按钮文字中间是否有空格
const config = reactive({
	autoInsertSpace: false
});

// element 语言配置
const i18nLocale = computed(() => {
	if (globalStore.language && globalStore.language == "zh") return zhCn;
	if (globalStore.language == "en") return en;
	return getBrowserLang() == "zh" ? zhCn : en;
});

// 配置全局组件大小 (small/default(medium)/large)
const assemblySize = computed((): string => globalStore.assemblySize);
</script>
<style scoped lang="scss">
@import "./layouts/components/Footer/index.scss";
</style>
