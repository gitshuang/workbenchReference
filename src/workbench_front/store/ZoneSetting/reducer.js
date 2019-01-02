import * as zonesetting from './action-type';

(() => {
	for (let key in zonesetting) {
		zonesetting[key] = `ZoneSetting/${zonesetting[key]}`;
	}
})();

let defaultState = {
	// 初始区域列表
	selectCard: [],
	areaList: [],
	previewData: []
};
// 首页表单数据
export const zoneSettingData = (state = defaultState, action = {}) => {
	switch (action.type) {
		case zonesetting.ZONESETTING:
			return { ...state, ...{ zoneArray: action.data } };
		case zonesetting.UPDATESELECTCARD:
			return { ...state, ...{ selectCard: action.selectCard } };
		case zonesetting.UPDATEAREALIST:
			return { ...state, ...{ areaList: action.areaList } };
		case zonesetting.PREVIEWDATA:
			return { ...state, ...{ previewData: action.previewData } };
		case zonesetting.CLEARDATA:
			return {
				...state,
				...defaultState
			};
		default:
			return state;
	}
};
