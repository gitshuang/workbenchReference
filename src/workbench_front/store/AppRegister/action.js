import * as AppRegister from './action-type';

// 清空数据
export const clearData = () => {
	return {
		type: AppRegister.CLEARDATA
	};
};
// 设置 树 数据
export const setTreeData = (data)=>{
	return {
		type: AppRegister.SETTREEDATA,
		data
	}
}
// 设置 树 数据
export const setNodeInfo = (data)=>{
	return {
		type: AppRegister.SETNODEINFO,
		data
	}
}
// 设置 树节点 数据
export const setNodeData = (data) => {
	return {
		type: AppRegister.SETNODEDATA,
		data
	};
};
// 设置 页面按钮 数据
export const setPageButtonData = (data) => {
	return {
		type: AppRegister.PAGEBUTTONDATA,
		data
	};
};
// 设置 页面模板 数据
export const setPageTemplateData = (data) => {
	return {
		type: AppRegister.PAGETEMPLATEDATA,
		data
	};
};
// 设置 应用参数信息 数据
export const setAppParamData = (data) => {
	return {
		type: AppRegister.APPPARAMDATA,
		data
	};
};
// 设置页面是否是新增
export const setIsNew = (data) => {
	return {
		type: AppRegister.ISNEW,
		data
	};
};
// 设置 页面是否是编辑
export const setIsEdit = (data) => {
	return {
		type: AppRegister.ISEDIT,
		data
	};
};
// 设置 树展开节点key数组
export const setExpandedKeys = (data) => {
	return {
		type: AppRegister.EXPANDEDKEYS,
		data
	};
};
// 设置 树展开节点key数组
export const setSelectedKeys = (data) => {
	return {
		type: AppRegister.SELECTEDKEYS,
		data
	};
};
// 设置 节点类型
export const setOptype = (data) => {
	return {
		type: AppRegister.OPTYPE,
		data
	};
};
// 设置 页面节点页签激活项
export const setPageActiveKey = (data) => {
	return {
		type: AppRegister.PAGEACTIVEKEY,
		data
	};
};
// 设置 多语
export const setLangJson = (data) => {
	return {
		type: AppRegister.LANGJSON,
		data
	};
};