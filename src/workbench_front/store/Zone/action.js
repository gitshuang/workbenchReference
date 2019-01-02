import * as ZoneRegister from './action-type';

// 设置 区域数据 
export const setZoneData = (data) => { 
	return {
		type: ZoneRegister.SETZONEDATA,
		data
	};
};

// 设置 区域对应的模板id 
export const setZoneTempletid = (data) => {
	return { 
		type: ZoneRegister.ZONETEMPLATID ,
		data
	};
};
// 设置 区域单据的模板状态 
export const setZoneState= (data) => {
	return {
		type: ZoneRegister.ZONESTATE,
		data
	};
};

// 传递 区域单据的模板数组 
export const setNewList = (data) => {
	return {
		type: ZoneRegister.SETNEWLIST,
		data
	};
};

// 传递 区域 form 的区域值 
export const setZoneDataFun = (getFromData) => {
	return {
		type: ZoneRegister.ZONEDATAFUN,
		getFromData
	};
};
// 清空数据
export const clearData = () => {
	return {
		type: ZoneRegister.CLEARDATA
	};
};
// setJson
export const setJson = (data) => {
	return {
		type: ZoneRegister.JSON,
		data
	};
};