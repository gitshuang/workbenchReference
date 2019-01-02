import * as AppRegister from './action-type';
import renameActionType from 'Store/renameActionType';
renameActionType(AppRegister, 'AppRegister');

let defaultState = {
    // 树数据
    treeData: [],
    // 树节点对象
    nodeData: {},
    // 树节点信息
    nodeInfo: {
        id: '',
        code: '',
        name: '',
        parentId: '',
        isleaf: false
    },
    // 应用参数数据
    appParamVOs: [],
    // 页面按钮数据
    appButtonVOs: [],
    // 页面模板数据
    pageTemplets: [],
    // 树展开树节点数组
    expandedKeys: [ '00' ],
    // 树选中节点数组
    selectedKeys: [ '00' ],
    // 节点类型
    optype: '',
    // 页面节点页签激活项
    pageActiveKey: '1',
    // 是否是新增
    isNew: false,
    // 是否是编辑
    isEdit: false,
    langJson: {}
};
// 首页表单数据
export const AppRegisterData = (state = defaultState, action = {}) => {
    switch (action.type) {
        case AppRegister.CLEARDATA:
            return {
                ...state,
                ...defaultState
            };
        case AppRegister.SETTREEDATA:
            return {
                ...state,
                ...{
                    treeData: action.data
                }
            };
        case AppRegister.SETNODEINFO:
            return {
                ...state,
                ...{
                    nodeInfo: action.data
                }
            };
        case AppRegister.SETNODEDATA:
            return {
                ...state,
                ...{
                    nodeData: action.data
                }
            };
        case AppRegister.APPPARAMDATA:
            return {
                ...state,
                ...{
                    appParamVOs: action.data
                }
            };
        case AppRegister.PAGEBUTTONDATA:
            return {
                ...state,
                ...{
                    appButtonVOs: action.data
                }
            };
        case AppRegister.PAGETEMPLATEDATA:
            return {
                ...state,
                ...{
                    pageTemplets: action.data
                }
            };
        case AppRegister.ISNEW:
            return {
                ...state,
                ...{
                    isNew: action.data
                }
            };
        case AppRegister.ISEDIT:
            return {
                ...state,
                ...{
                    isEdit: action.data
                }
            };
        case AppRegister.EXPANDEDKEYS:
            return {
                ...state,
                ...{
                    expandedKeys: Array.from(new Set(action.data.concat([ '00' ])))
                }
            };
        case AppRegister.SELECTEDKEYS:
            return {
                ...state,
                ...{
                    selectedKeys: action.data
                }
            };
        case AppRegister.OPTYPE:
            return {
                ...state,
                ...{
                    optype: action.data
                }
            };
        case AppRegister.PAGEACTIVEKEY:
            return {
                ...state,
                ...{
                    pageActiveKey: action.data
                }
            };
        case AppRegister.LANGJSON:
            return {
                ...state,
                ...{
                    langJson: action.data
                }
            };
        default:
            return state;
    }
};
