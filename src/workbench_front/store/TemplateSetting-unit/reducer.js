import * as TemplateSettingUnit from './action-type';
import renameActionType from 'Store/renameActionType';
renameActionType(TemplateSettingUnit, 'TemplateSettingUnit');

let defaultState = {
    // 树数据
    treeData: [],
    //页面模板树 数据
    treeTemBillData: [],
    //打印模板树 数据
    treeTemPrintData: [],
    def1: '',
    // 应用参数数据
    appParamVOs: [],
    // 页面按钮数据
    appButtonVOs: [],
    // 页面模板数据
    pageTemplets: [],
    // 树展开树节点数组
    expandedKeys: ['00'],
    // 树选中节点数组
    selectedKeys: ['00'],
    selectedTemKeys: [],
    expandedTemKeys: [],
    templatePk: '',
    searchValue: '',
    appCode: '',
    pageCode: '',
    parentIdcon: '',
    templateNameVal: '',
    templateTitleVal: '',
    orgidObj: {
        // 默认业务单元
        refcode: '',
        refname: '',
        refpk: ''
    },
    nodeKey: [],
    copyId: '',
    roCheckedObjArray: [],
    roleUserDatas: {},
    json: {},
    templateType: ''
};
// 首页表单数据
export const TemplateSettingUnitData = (state = defaultState, action = {}) => {
    switch (action.type) {
        case TemplateSettingUnit.CLEARDATA:
            return {
                ...state,
                ...defaultState
            };
        case TemplateSettingUnit.SELECTEDTEMKEYS:
            return {
                ...state,
                ...{
                    selectedTemKeys: action.data
                }
            };
        case TemplateSettingUnit.EXPANDEDTEMKEYS:
            return {
                ...state,
                ...{
                    expandedTemKeys: action.data
                }
            };
        case TemplateSettingUnit.SETTREEDATA:
            return {
                ...state,
                ...{
                    treeData: action.data
                }
            };
        case TemplateSettingUnit.SETTREETEMBILLDATA:
            return {
                ...state,
                ...{
                    treeTemBillData: action.data
                }
            };
        case TemplateSettingUnit.SETDEF1:
            return {
                ...state,
                ...{
                    def1: action.data
                }
            };
        case TemplateSettingUnit.SETTREETEMPRINTDATA:
            return {
                ...state,
                ...{
                    treeTemPrintData: action.data
                }
            };
        case TemplateSettingUnit.EXPANDEDKEYS:
            return {
                ...state,
                ...{
                    expandedKeys: action.data.concat(['00'])
                }
            };
        case TemplateSettingUnit.SELECTEDKEYS:
            return {
                ...state,
                ...{
                    selectedKeys: action.data
                }
            };
        case TemplateSettingUnit.TEMPLATEPK:
            return {
                ...state,
                ...{
                    templatePk: action.data
                }
            };
        case TemplateSettingUnit.SEARCHVALUE:
            return {
                ...state,
                ...{
                    searchValue: action.data
                }
            };
        case TemplateSettingUnit.PAGECODE:
            return {
                ...state,
                ...{
                    pageCode: action.data
                }
            };
        case TemplateSettingUnit.APPCODE:
            return {
                ...state,
                ...{
                    appCode: action.data
                }
            };
        case TemplateSettingUnit.PARENTIDCON:
            return {
                ...state,
                ...{
                    parentIdcon: action.data
                }
            };
        case TemplateSettingUnit.TEMPLATENAMEVAL:
            return {
                ...state,
                ...{
                    templateNameVal: action.data
                }
            };
        case TemplateSettingUnit.TEMPLATETITLEVAL:
            return {
                ...state,
                ...{
                    templateTitleVal: action.data
                }
            };
        case TemplateSettingUnit.ORGIDOBJ:
            return {
                ...state,
                ...{
                    orgidObj: action.data
                }
            };
        case TemplateSettingUnit.NODEKEY:
            return {
                ...state,
                ...{
                    nodeKey: action.data
                }
            };
        case TemplateSettingUnit.COPYID:
            return {
                ...state,
                ...{
                    copyId: action.data
                }
            };
        case TemplateSettingUnit.ROCHECKEDOBJARRAY:
            return {
                ...state,
                ...{
                    roCheckedObjArray: action.data
                }
            };
        case TemplateSettingUnit.ROLEUSERDATAS:
            return {
                ...state,
                ...{
                    roleUserDatas: action.data
                }
            };
        case TemplateSettingUnit.JSON:
            return {
                ...state,
                ...{
                    json: action.data
                }
            };
        case TemplateSettingUnit.TEMPLATETYPE:
            return {
                ...state,
                ...{
                    templateType: action.data
                }
            };
        default:
            return state;
    }
};