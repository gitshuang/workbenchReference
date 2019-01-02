import * as mr from './action-type';

// 菜单数据
export const updateMenuItemData = (value) => {
	return {
		type: mr.MENUDATA,
		value
	};
};

// 菜单数据
export const setMenuId = (value) => {
	return {
		type: mr.MENUID,
		value
	};
};

// 模态框显隐性设置
export const setModalVisible = (value) => {
	return {
		type: mr.VISIBLE,
		value
	};
};

// 设置获取树数据方法
export const setGetSelectedTreeDataFun = (value) => {
	return {
		type: mr.GETSELECTEDTREEDATA,
		value
	};
};

// 设置多语方法
export const updateLangMulti = (value) => {
	return {
		type: mr.LANGMULTI,
		value
	};
};
