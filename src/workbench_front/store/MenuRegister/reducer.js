import * as mr from "./action-type";
import renameActionType from "Store/renameActionType";
renameActionType(mr, "mr");

let defaultState = {
    menuItemData: {
        pk_menu: "",
        menucode: "",
        menuname: "",
        menudesc: "",
        isenable: false,
        isdefault: false,
        creator: "",
        creationtime: "",
        modifier: "",
        modifiedtime: ""
    },
    visible: false,
    menuId: "",
    langMultiData: {},
    getSelectedTreeData: () => {}
};
// 首页表单数据
export const menuRegisterData = (state = defaultState, action = {}) => {
    switch (action.type) {
        case mr.MENUDATA:
            return {
                ...state,
                menuItemData: {
                    ...action.value
                }
            };
        case mr.MENUID:
            return {
                ...state,
                menuId: action.value
            };
        case mr.VISIBLE:
            return {
                ...state,
                visible: action.value
            };
        case mr.GETSELECTEDTREEDATA:
            return {
                ...state,
                getSelectedTreeData: action.value
            };
        case mr.LANGMULTI:
            return {
                ...state,
                langMultiData: action.value
            };
        default:
            return state;
    }
};
