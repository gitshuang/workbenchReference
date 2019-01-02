import * as AppManagement from './action-type';
import renameActionType from 'Store/renameActionType';
renameActionType(AppManagement, 'AppManagement');
let defaultState = {
    // 树数据
    treeData: [],
    // 菜单树数据
    menuTreeData: [],
    // 树节点对象
    nodeData: {},
    // 树节点信息
    nodeInfo: {
        id: '',
        code: '',
        name: '',
        parentId: '',
        iscopypage: false
    },
    // 应用复制表单数据
    copyNodeData: {},
    // 页面复制表单数据
    pageCopyData: {},
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
    //多语
    langJson: {}
};
// 首页表单数据
export const AppManagementData = (state = defaultState, action = {}) => {
    switch (action.type) {
        case AppManagement.CLEARDATA:
            return {
                ...state,
                ...defaultState
            };
        case AppManagement.SETTREEDATA:
            return {
                ...state,
                ...{
                    treeData: action.data
                }
            };
        case AppManagement.SETNODEINFO:
            return {
                ...state,
                ...{
                    nodeInfo: action.data
                }
            };
        case AppManagement.SETNODEDATA:
            return {
                ...state,
                ...{
                    nodeData: action.data
                }
            };
        case AppManagement.APPPARAMDATA:
            return {
                ...state,
                ...{
                    appParamVOs: action.data
                }
            };
        case AppManagement.PAGEBUTTONDATA:
            return {
                ...state,
                ...{
                    appButtonVOs: action.data
                }
            };
        case AppManagement.PAGETEMPLATEDATA:
            return {
                ...state,
                ...{
                    pageTemplets: action.data
                }
            };
        case AppManagement.ISNEW:
            return {
                ...state,
                ...{
                    isNew: action.data
                }
            };
        case AppManagement.ISEDIT:
            return {
                ...state,
                ...{
                    isEdit: action.data
                }
            };
        case AppManagement.EXPANDEDKEYS:
            return {
                ...state,
                ...{
                    expandedKeys: Array.from(new Set(action.data.concat([ '00' ])))
                }
            };
        case AppManagement.SELECTEDKEYS:
            return {
                ...state,
                ...{
                    selectedKeys: action.data
                }
            };
        case AppManagement.OPTYPE:
            return {
                ...state,
                ...{
                    optype: action.data
                }
            };
        case AppManagement.PAGEACTIVEKEY:
            return {
                ...state,
                ...{
                    pageActiveKey: action.data
                }
            };
        case AppManagement.MENUTREEDATA:
            return {
                ...state,
                ...{
                    menuTreeData: action.data
                }
            };
        case AppManagement.COPYNODEDATA:
            return {
                ...state,
                ...{
                    copyNodeData: action.data
                }
            };
        case AppManagement.PAGECOPYDATA:
            return {
                ...state,
                ...{
                    pageCopyData: action.data
                }
            };
        case AppManagement.LANGJSON:
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
