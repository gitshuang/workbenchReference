import * as TemplateSettingUnit from './action-type';

// 清空数据
export const clearData = () => {
	return {
		type: TemplateSettingUnit.CLEARDATA
	};
};
// 设置 树 数据
export const setTreeData = (data)=>{
	return {
		type: TemplateSettingUnit.SETTREEDATA,
		data
	}
}
// 设置 页面模板 树 数据
export const setTreeTemBillData = (data)=>{
	return {
		type: TemplateSettingUnit.SETTREETEMBILLDATA,
		data
	}
}
// 设置 打印模板 树 数据
export const setTreeTemPrintData = (data)=>{
	return {
		type: TemplateSettingUnit.SETTREETEMPRINTDATA,
		data
	}
}
//设置页面与应用区分数据
export const setDef1 = (data)=>{
	return {
		type: TemplateSettingUnit.SETDEF1,
		data
	}
}
// 设置 右侧模板树展开节点
export const setExpandedTemKeys = (data) => {
	return {
		type: TemplateSettingUnit.EXPANDEDTEMKEYS,
		data
	};
};
// 设置 树展开节点key数组
export const setExpandedKeys = (data) => {
	return {
		type: TemplateSettingUnit.EXPANDEDKEYS,
		data
	};
};
// 设置 树展开节点key数组
export const setSelectedKeys = (data) => {
	return {
		type: TemplateSettingUnit.SELECTEDKEYS,
		data
	};
};
//设置 树选中节点 数组
export const setSelectedTemKeys = (data) => {
	return {
		type: TemplateSettingUnit.SELECTEDTEMKEYS,
		data
	};
};
//TEMPLATEPK
export const setTemplatePk = (data) => {
	return {
		type: TemplateSettingUnit.TEMPLATEPK,
		data
	};
};
//searchValue
export const setSearchValue = (data) => {
	return {
		type: TemplateSettingUnit.SEARCHVALUE,
		data
	};
};
//setPageCode
export const setPageCode = (data) => {
	return {
		type: TemplateSettingUnit.PAGECODE,
		data
	};
};
//setAppCode
export const setAppCode = (data) => {
	return {
		type: TemplateSettingUnit.APPCODE,
		data
	};
};
// parentIdcon
export const setParentIdcon = (data) => {
	return {
		type: TemplateSettingUnit.PARENTIDCON,
		data
	};
};
//setTemplateNameVal
export const setTemplateNameVal = (data) => {
	return {
		type: TemplateSettingUnit.TEMPLATENAMEVAL,
		data
	};
}
//setTemplateTitleVal
export const setTemplateTitleVal = (data) => {
	return {
		type: TemplateSettingUnit.TEMPLATETITLEVAL,
		data
	};
}
//setOrgidObj
export const setOrgidObj = (data) => {
	return {
		type: TemplateSettingUnit.ORGIDOBJ,
		data
	};
}
//setNodeKey
export const setNodeKey = (data) => {
	return {
		type: TemplateSettingUnit.NODEKEY,
		data
	};
}
//setCopyId
export const setCopyId = (data) => {
	return {
		type: TemplateSettingUnit.COPYID,
		data
	};
}
//roCheckedObjArray
export const setRoCheckedObjArray = (data) => {
	return {
		type: TemplateSettingUnit.ROCHECKEDOBJARRAY,
		data
	};
}
//roleUserDatas
export const setRoleUserDatas = (data) => {
	return {
		type: TemplateSettingUnit.ROLEUSERDATAS,
		data
	};
}
//setJson
export const setJson = (data) => {
	return {
		type: TemplateSettingUnit.JSON,
		data
	};
}
//setTemplateType
export const setTemplateType = (data) => {
	return {
		type: TemplateSettingUnit.TEMPLATETYPE,
		data
	};
}
