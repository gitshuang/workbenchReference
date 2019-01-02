import * as TemplateSetting from './action-type';
import renameActionType from 'Store/renameActionType';
renameActionType(TemplateSetting, 'TemplateSetting');

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
    expandedKeys: [ '00' ],
    // 树选中节点数组
    selectedKeys: [ '00' ],
    selectedTemKeys:[],
    expandedTemKeys:[],
    templatePk:'',
    searchValue:'',
    appCode:'',
    pageCode:'',
    parentIdcon:'',
    templateNameVal:'',
    templateTitleVal:'',
    nodeKey:[],
    copyId:'',
    roCheckedObjArray:[],
    roleUserDatas:{},
    json:{},
    isDefaultTem:''
};
// 首页表单数据
export const TemplateSettingData = (state = defaultState, action = {}) => {
    switch (action.type) {
        case TemplateSetting.CLEARDATA:
            return {
                ...state,
                ...defaultState
            };
        case TemplateSetting.SELECTEDTEMKEYS:
            return {
              ...state,
              ...{
                selectedTemKeys: action.data
              }
            };
        case TemplateSetting.EXPANDEDTEMKEYS:
          return {
            ...state,
            ...{
              expandedTemKeys: action.data
          }
        };
        case TemplateSetting.SETTREEDATA:
            return {
                ...state,
                ...{
                    treeData: action.data
                }
            };
        case TemplateSetting.SETTREETEMBILLDATA:
            return {
                ...state,
                ...{
                    treeTemBillData: action.data
                }
            };
        case TemplateSetting.SETDEF1:
        return {
            ...state,
            ...{
                def1: action.data
            }
        };   
        case TemplateSetting.SETTREETEMPRINTDATA:
            return {
                ...state,
                ...{
                    treeTemPrintData: action.data
                }
            };
        case TemplateSetting.EXPANDEDKEYS:
            return {
                ...state,
                ...{
                    expandedKeys: action.data.concat([ '00' ])
                }
            };
        case TemplateSetting.SELECTEDKEYS:
            return {
                ...state,
                ...{
                    selectedKeys: action.data
                }
            };
        case TemplateSetting.TEMPLATEPK:
            return {
                ...state,
                ...{
                    templatePk: action.data
                }
        };
        case TemplateSetting.SEARCHVALUE:
            return {
                ...state,
                ...{
                    searchValue: action.data
                }
        };
        case TemplateSetting.PAGECODE:
            return {
                ...state,
                ...{
                    pageCode: action.data
                }
        };
        case TemplateSetting.APPCODE:
            return {
                ...state,
                ...{
                    appCode: action.data
                }
        };
        case TemplateSetting.PARENTIDCON:
            return {
                ...state,
                ...{
                    parentIdcon: action.data
                }
        };
        case TemplateSetting.TEMPLATENAMEVAL:
            return {
                ...state,
                ...{
                    templateNameVal: action.data
                }
        };
        case TemplateSetting.TEMPLATETITLEVAL:
            return {
                ...state,
                ...{
                    templateTitleVal: action.data
                }
        };
        case TemplateSetting.NODEKEY:
            return {
                ...state,
                ...{
                    nodeKey: action.data
                }
        };
        case TemplateSetting.COPYID:
            return {
                ...state,
                ...{
                    copyId: action.data
                }
        };
        case TemplateSetting.ROCHECKEDOBJARRAY:
            return {
                ...state,
                ...{
                    roCheckedObjArray: action.data
                }
        };
        case TemplateSetting.ROLEUSERDATAS:
            return {
                ...state,
                ...{
                    roleUserDatas: action.data
                }
        };
        case TemplateSetting.JSON:
            return {
                ...state,
                ...{
                    json: action.data
                }
        };
        case TemplateSetting.ISDEFAULTTEM:
            return {
                ...state,
                ...{
                    isDefaultTem: action.data
                }
        };
        default:
            return state;
    }
};
