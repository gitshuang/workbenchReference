import * as ifr from './action-type';

// 初始化数据
export const initIfrData = (value) => {
	return {
		type: ifr.INITIFR,
		value
	};
};

// 清除数据
export const clearData = () => {
	return {
		type: ifr.CLEARDATA
	};
};

