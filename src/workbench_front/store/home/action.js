import * as home from './action-type';

// 保存图片地址
export const clearData = () => {
	return {
		type: home.CLEARDATA
	};
};

export const updateGroupList = (groups) => {
	return {
		type: home.UPDATEGROUPLIST,
		groups: groups
	};
};
// 更新首页
export const setUpdateHomePageFun = (data) => {
	return {
		type: home.UPDATEHOMEPAGE,
		updateHomePage:data
	};
};