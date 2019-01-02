import * as ZoneRegister from './action-type';
import renameActionType from 'Store/renameActionType';
renameActionType(ZoneRegister, 'ZoneRegister');
let defaultState = {
	// 初始区域列表 
	templatid:'',
	zoneState:'',
	zoneDatas:{},
	json:{},
	newListData:[],
	zoneFormData:()=>{},
};
// 首页表单数据
export const zoneRegisterData = (state = defaultState, action = {}) => {
	switch (action.type) {
		case ZoneRegister.ZONETEMPLATID:
			return {
				...state,
				...{
					templetid: action.data
				}
			};
		case ZoneRegister.SETZONEDATA:
			return {
				...state,
				...{
					zoneDatas: action.data
				}
			};
		case ZoneRegister.SETNEWLIST:
			return {
				...state,
				...{
					newListData: action.data
				}
			};
		case ZoneRegister.ZONEDATAFUN:
			return {
				...state,
				...{
					zoneFormData: action.getFromData
				}
			};
			case ZoneRegister.JSON:
			return {
				...state,
				...{
					json: action.data
				}
			};
		case ZoneRegister.CLEARDATA:
			return {
				...state,
				...defaultState
			};
		default:
			return state;
	}
};