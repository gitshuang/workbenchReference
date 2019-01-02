import * as appStore from "./action-type";
import renameActionType from "Store/renameActionType";
import Avatar from "Assets/images/userLogo.png";
renameActionType(appStore, "appStore");

let defaultState = {
    lang: "zh-CN",
    intlDone: false,
    avatar: Avatar,
    isOpen: false,
    userId: "",
    userCode: "", //用户编码
    userName: "用户名称",
    email: "", // 邮箱
    currentData: [], // 所属集团数组
    businessDate: "", // 业务日期
    groupId: "", // 组织id
    groupName: "", // 组织名称
    projectCode: "", //项目编码
    nlinkUrl: "", // PE服务地址
    needBind: false, //是否需要绑定云账号 (false 不需要显示云注册弹窗.)
    is_cloud_register: false //是否云注册用户 (false 不需要单点登陆,不需要显示小铃铛.)
};
// 首页表单数据
export const appData = (state = defaultState, action = {}) => {
    switch (action.type) {
        case appStore.INITAPPDATA:
            return { ...state, ...action.value };
        case appStore.CHANGELANG:
            return { ...state, ...{ intlDone: action.value } };
        case appStore.DRAWEROPEN:
            return { ...state, ...{ isOpen: action.value } };
        case appStore.ACCOUNTINFO:
            return { ...state, ...action.value };
        case appStore.AVATAREDIT:
            return { ...state, ...{ avatar: action.value } };
        case appStore.EMAIL:
            return { ...state, ...{ email: action.value } };
        case appStore.ACCOUNTACTIVATION:
            return { ...state, ...{ is_cloud_register: true, needBind: false } };
        default:
            return state;
    }
};
