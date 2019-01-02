import * as AppManagement from './action-type';

// 清空数据
export const clearData = () => {
	return {
		type: AppManagement.CLEARDATA
	};
};
// 设置 树 数据
export const setTreeData = (data)=>{
	return {
		type: AppManagement.SETTREEDATA,
		data
	}
}
// 设置 树 数据
export const setNodeInfo = (data)=>{
	return {
		type: AppManagement.SETNODEINFO,
		data
	}
}
// 设置 树节点 数据
export const setNodeData = (data) => {
	return {
		type: AppManagement.SETNODEDATA,
		data
	};
};
// 设置 页面按钮 数据
export const setPageButtonData = (data) => {
	return {
		type: AppManagement.PAGEBUTTONDATA,
		data
	};
};
// 设置 页面模板 数据
export const setPageTemplateData = (data) => {
	return {
		type: AppManagement.PAGETEMPLATEDATA,
		data
	};
};
// 设置 应用参数信息 数据
export const setAppParamData = (data) => {
	return {
		type: AppManagement.APPPARAMDATA,
		data
	};
};
// 设置页面是否是新增
export const setIsNew = (data) => {
	return {
		type: AppManagement.ISNEW,
		data
	};
};
// 设置 页面是否是编辑
export const setIsEdit = (data) => {
	return {
		type: AppManagement.ISEDIT,
		data
	};
};
// 设置 树展开节点key数组
export const setExpandedKeys = (data) => {
	return {
		type: AppManagement.EXPANDEDKEYS,
		data
	};
};
// 设置 树展开节点key数组
export const setSelectedKeys = (data) => {
	return {
		type: AppManagement.SELECTEDKEYS,
		data
	};
};
// 设置 节点类型
export const setOptype = (data) => {
	return {
		type: AppManagement.OPTYPE,
		data
	};
};
// 设置 页面节点页签激活项
export const setPageActiveKey = (data) => {
	return {
		type: AppManagement.PAGEACTIVEKEY,
		data
	};
};
// 菜单树数据
export const setMenuTreeData = (data) => {
	return {
		type: AppManagement.MENUTREEDATA,
		data
	};
};
// 应用复制表单数据设置
export const setCopyNodeData = (data) => {
	return {
		type: AppManagement.COPYNODEDATA,
		data
	};
};
// 页面复制表单数据设置
export const setPageCopyData = (data) => {
	return {
		type: AppManagement.PAGECOPYDATA,
		data
	};
};
// 页面复制表单数据设置
export const setLangJson = (data) => {
	return {
		type: AppManagement.LANGJSON,
		data
	};
};