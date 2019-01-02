import * as templateStore from './action-type';

(() => {
	for (let key in templateStore) {
		templateStore[key] = `test/${templateStore[key]}`;
	}
})();

let defaultState = {
	shadowCard: {},
	initialGroups: [],
	groups: [],
	currEditID: '',
	layout: {
		containerWidth: 1200,
		containerHeight: 200,
		calWidth: 175,
		rowHeight: 175,
		col: 6,
		margin: [ 10, 10 ],
		containerPadding: [ 0, 0 ]
	},
	defaultLayout: {
		containerWidth: 1200,
		containerHeight: 200,
		calWidth: 175,
		rowHeight: 175,
		col: 6,
		margin: [ 10, 10 ],
		containerPadding: [ 0, 0 ]
	},
	json:{}
};
// 首页表单数据
export const templateDragData = (state = defaultState, action = {}) => {
	switch (action.type) {
		case templateStore.CLEARDATA:
			return {
				...state,
				...defaultState
			};
		case templateStore.UPDATESHADOWCARD:
			return { ...state, ...{ shadowCard: action.shadowCard } };
		case templateStore.UPDATEGROUPLIST:
			return { ...state, ...{ groups: action.groups } };
		case templateStore.UPDATECURREDITID:
			return { ...state, ...{ currEditID: action.currEditID } };
		case templateStore.INITGROUPS:
			return { ...state, ...{ initialGroups: action.initialGroups } };
		case templateStore.UPDATELAYOUT:
			return { ...state, ...{ layout: action.layout } };
		case templateStore.JSON:
			return { ...state, ...{ json: action.json } };
		default:
			return state;
	}
};
