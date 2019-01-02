import * as zonesetting from './action-type';

// 设置 区域参数信息 数据
export const setZoneData = (data) => {
	return {
		type: zonesetting.ZONESETTING,
		data
	};
};
export const updateSelectCard = (selectCard) => {
	return {
		type: zonesetting.UPDATESELECTCARD,
		selectCard: selectCard
	};
};
export const updateAreaList = (areaList) => {
	return {
		type: zonesetting.UPDATEAREALIST,
		areaList: areaList
	};
};
export const updatePreviewData = (previewData) => {
	return {
		type: zonesetting.PREVIEWDATA,
		previewData: previewData
	};
};
// 清空数据
export const clearData = () => {
	return {
		type: zonesetting.CLEARDATA
	};
};