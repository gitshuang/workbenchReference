import * as TemplateSetting from './action-type';

// 清空数据
export const clearData = () => {
	return {
		type: TemplateSetting.CLEARDATA
	};
};
// 设置 树 数据
export const setTreeData = (data)=>{
	return {
		type: TemplateSetting.SETTREEDATA,
		data
	}
}
// 设置 页面模板 树 数据
export const setTreeTemBillData = (data)=>{
	return {
		type: TemplateSetting.SETTREETEMBILLDATA,
		data
	}
}
// 设置 打印模板 树 数据
export const setTreeTemPrintData = (data)=>{
	return {
		type: TemplateSetting.SETTREETEMPRINTDATA,
		data
	}
}
//设置页面与应用区分数据
export const setDef1 = (data)=>{
	return {
		type: TemplateSetting.SETDEF1,
		data
	}
}
// 设置 右侧模板树展开节点
export const setExpandedTemKeys = (data) => {
	return {
		type: TemplateSetting.EXPANDEDTEMKEYS,
		data
	};
};
// 设置 树展开节点key数组
export const setExpandedKeys = (data) => {
	return {
		type: TemplateSetting.EXPANDEDKEYS,
		data
	};
};
// 设置 树展开节点key数组
export const setSelectedKeys = (data) => {
	return {
		type: TemplateSetting.SELECTEDKEYS,
		data
	};
};
//设置 树选中节点 数组
export const setSelectedTemKeys = (data) => {
	return {
		type: TemplateSetting.SELECTEDTEMKEYS,
		data
	};
};
//TEMPLATEPK
export const setTemplatePk = (data) => {
	return {
		type: TemplateSetting.TEMPLATEPK,
		data
	};
};
//searchValue
export const setSearchValue = (data) => {
	return {
		type: TemplateSetting.SEARCHVALUE,
		data
	};
};
//setPageCode
export const setPageCode = (data) => {
	return {
		type: TemplateSetting.PAGECODE,
		data
	};
};
//setAppCode
export const setAppCode = (data) => {
	return {
		type: TemplateSetting.APPCODE,
		data
	};
};
// parentIdcon
export const setParentIdcon = (data) => {
	return {
		type: TemplateSetting.PARENTIDCON,
		data
	};
}
//setTemplateNameVal
export const setTemplateNameVal = (data) => {
	return {
		type: TemplateSetting.TEMPLATENAMEVAL,
		data
	};
}
//setTemplateTitleVal
export const setTemplateTitleVal = (data) => {
	return {
		type: TemplateSetting.TEMPLATETITLEVAL,
		data
	};
}
//setNodeKey
export const setNodeKey = (data) => {
	return {
		type: TemplateSetting.NODEKEY,
		data
	};
}
//setCopyId
export const setCopyId = (data) => {
	return {
		type: TemplateSetting.COPYID,
		data
	};
}
//roCheckedObjArray
export const setRoCheckedObjArray = (data) => {
	return {
		type: TemplateSetting.ROCHECKEDOBJARRAY,
		data
	};
}
//roleUserDatas
export const setRoleUserDatas = (data) => {
	return {
		type: TemplateSetting.ROLEUSERDATAS,
		data
	};
}
//setJson
export const setJson = (data) => {
	return {
		type: TemplateSetting.JSON,
		data
	};
}
//setIsDefaultTem
export const setIsDefaultTem = (data) =>{
	return {
		type:TemplateSetting.ISDEFAULTTEM,
		data
	}
}
