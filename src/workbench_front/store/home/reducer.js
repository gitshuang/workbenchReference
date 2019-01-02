import * as home from './action-type';
import renameActionType from 'Store/renameActionType';
renameActionType(home,'home');

let defaultState = {
	groups:[],
	updateHomePage:()=>{}
};
// 首页表单数据
export const homeData = (state = defaultState, action = {}) => {
	switch (action.type) {
		case home.CLEARDATA:
			return { ...state, ...defaultState };
		case home.UPDATEGROUPLIST:
			return { ...state, ...{ groups: action.groups } };
		case home.UPDATEHOMEPAGE:
			return { ...state, ...{ updateHomePage: action.updateHomePage } };
		default:
			return state;
	}
};
