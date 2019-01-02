import * as appStore from './action-type';

// 初始化应用数据
export const initAppData = (value) => {
	return {
		type: appStore.INITAPPDATA,
		value
	};
};
// 切换语言
export const changeIntlData = (value) => {
	return {
		type: appStore.CHANGELANG,
		value
	};
};
// 个人信息栏是否展开
export const changeDrawer = (value) => {
	return {
		type: appStore.DRAWEROPEN,
		value
	};
};
// 账户信息
export const setAccountInfo = (value) => {
	return {
		type: appStore.ACCOUNTINFO,
		value
	};
};
// 用户图标修改
export const setAvatar = (value) => {
	return {
		type: appStore.AVATAREDIT,
		value
	};
};
// 用户邮箱修改
export const setEmail = (value) => {
	return {
		type: appStore.EMAIL,
		value
	};
};
// 云账号绑定成功
export const bindSuccess = () => {
	return {
		type:appStore.ACCOUNTACTIVATION,
	}
}


