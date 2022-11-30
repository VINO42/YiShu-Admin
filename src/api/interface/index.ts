// * 请求响应参数(不包含data)
export interface Result {
	status: number;
	message: string;
}

// * 请求响应参数(包含data)
export interface ResultData<T = any> extends Result {
	data: T;
}

// * 分页响应参数
export interface ResPage<T> {
	records: T[];
	current: number;
	size: number;
	total: number;
}

// * 分页请求参数
export interface ReqPage {
	current: number;
	size: number;
}

// * 登录模块
export namespace Login {
	export interface ReqLoginForm {
		username: string;
		password: string;
	}
	export interface ResLogin {
		token: string;
	}
	export interface ResAuthButtons {
		[key: string]: {
			[key: string]: boolean;
		};
	}
}

// * 用户管理模块
export namespace User {
	export interface ReqGetUserParams extends ReqPage {
		realName: string;
		gender: number;
		idCard: string;
		mobile: string;
		addr: string;
		// createTime: string[];
		// status: string;
		displayStatus: number;
	}
	export interface ResUserList {
		id: string;
		realName: string;
		gender: string;
		age: number;
		idCard: string;
		mobile: string;
		addr: string;
		// createTime: string;
		// status: string;
		displayStatus: number;
		avatar: string;
		children?: ResUserList[];
	}
	export interface ResStatus {
		userLabel: string;
		userValue: number;
	}
	export interface ResGender {
		genderLabel: string;
		genderValue: number;
	}
	export interface ResDepartment {
		id: string;
		name: string;
		children?: ResDepartment[];
	}
}

// * 账号管理模块
export namespace Account {
	export interface ReqGetAccountParams extends ReqPage {
		mobile: string;
		unionId: string;
		nickName: number;
		userId: string;
		// createTime: string[];
		// status: string;
		displayStatus: number;
	}
	export interface ResAccountList {
		id: string;
		mobile: string;
		unionId: string;
		nickName: number;
		userId: string;
		// createTime: string;
		// status: string;
		displayStatus: number;
		avatar: string;
		children?: ResAccountList[];
	}
	export interface ResStatus {
		userLabel: string;
		userValue: number;
	}
}
//用户组管理
export namespace UserGroup {
	export interface ReqGetUserGroupParams extends ReqPage {
		userGroupName: string;
		userGroupCode: string;
		displayStatus: number;
	}
	export interface ResUserGroupList {
		id: string;
		userGroupName: string;
		userGroupCode: string;
		versionStamp: number;
		displayStatus: number;
		children?: ResUserGroupList[];
	}

	export interface ResAllocateList {
		id: string;
		name: string;
	}
	export interface ResUserGroupRolesList {
		id: string;
	}
	export interface ResStatus {
		userLabel: string;
		userValue: number;
	}
}
//角色管理
export namespace Role {
	export interface ReqGetRoleParams extends ReqPage {
		roleName: string;
		roleCode: string;
		displayStatus: number;
	}
	export interface ResRoleList {
		id: string;
		roleName: string;
		roleCode: string;
		versionStamp: number;
		displayStatus: number;
		children?: ResRoleList[];
	}
	export interface ResStatus {
		userLabel: string;
		userValue: number;
	}
}

// * 文件上传模块
export namespace Upload {
	export interface ResFileUrl {
		fileUrl: string;
	}
}
