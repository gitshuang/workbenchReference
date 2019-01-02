import * as ifr from './action-type';
import renameActionType from 'Store/renameActionType';
renameActionType(ifr,'ifr');

let defaultState = {
	ifrName: 'xxx', //窗口名称
	ifrID: '123' //窗口id
};
// 首页表单数据
export const ifrData = (state = defaultState, action = {}) => {
	switch (action.type) {
		case ifr.INITIFR:
			return { ...state, ...adcion.value };
		case ifr.CLEARDATA:
			return { ...state, ...defaultState };
		default:
			return state;
	}
};
