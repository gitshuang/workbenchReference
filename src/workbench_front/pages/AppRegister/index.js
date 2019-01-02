import React, { Component } from "react";
import { Form } from "antd";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import {
    setTreeData,
    setNodeInfo,
    setNodeData,
    setPageButtonData,
    setPageTemplateData,
    setAppParamData,
    setIsNew,
    setIsEdit,
    setExpandedKeys,
    setSelectedKeys,
    setOptype,
    setLangJson
} from "Store/AppRegister/action";
import Ajax from "Pub/js/ajax";
import SearchTree from "./SearchTree";
import ModuleFormCard from "./ModuleFormCard";
import ClassFormCard from "./ClassFormCard";
import AppFormCard from "./AppFormCard";
import PageFromCard from "./PageFromCard";
import {
    PageLayout,
    PageLayoutHeader,
    PageLayoutLeft,
    PageLayoutRight
} from "Components/PageLayout";
import { DeferFn } from "Pub/js/utils";
import ButtonCreate from "Components/ButtonCreate";
import Notice from "Components/Notice";
import {
    DelPrompts,
    SavePrompts,
    CancelPrompts
} from "Components/EventPrompts";
import ExportAppBtn from "./ExportAppBtn";
import { getMulti } from "Pub/js/getMulti";
import { langCheck } from "Pub/js/utils";
import "./index.less";
/**
 * 工作桌面 首页 页面
 * 各个此贴应用及工作台中的小部件 通过 js 片段进行加载渲染
 */

class AppRegister extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.historyOptype;
        this.historyNodeData;
    }
    /**
     * 按钮点击事件
     * @param {String} code
     */
    handleClick = code => {
        switch (code) {
            case "addModule":
                this.addModule();
                break;
            case "addAppClass":
                this.addAppClass();
                break;
            case "addApp":
                this.addApp();
                break;
            case "addPage":
                this.addPage();
                break;
            case "save":
                this.props.form.validateFields(
                    // { first: true, force: true },
                    (errors, values) => {
                        if (!errors) {
                            this.save();
                        }
                    }
                );
                break;
            case "cancel":
                CancelPrompts(() => {
                    this.props.setNodeData(this.historyNodeData);
                    this.props.form.resetFields();
                    this.props.setIsNew(false);
                    this.props.setIsEdit(false);
                    this.props.setOptype(this.historyOptype);
                });
                break;
            case "del":
                this.del();
                break;
            case "edit":
                this.historyNodeData = this.props.nodeData;
                this.historyOptype = this.props.optype;
                this.props.setIsNew(false);
                this.props.setIsEdit(true);
                break;
            case "exportApp":
                this.exportTemplateBtn();
                break;
            default:
                break;
        }
    };
    /**
     * 导出页面模板按钮事件
     */
    exportTemplateBtn = () => {
        let { langJson } = this.props;
        DeferFn(() => {
            Ajax({
                url: `/nccloud/platform/templet/extractRes.do`,
                info: {
                    name: langCheck(
                        "102202APP-000072",
                        "pages",
                        langJson
                    ) /* 国际化处理： 应用注册页面*/,
                    action: langCheck(
                        "102202APP-000073",
                        "pages",
                        langJson
                    ) /* 国际化处理： 导出页面模板多语*/
                },
                data: {
                    appcode: this.props.nodeData.code
                },
                success: ({ data }) => {
                    if (data.success && data.data) {
                        Notice({
                            status: "success",
                            msg: data.data
                        });
                    }
                }
            });
        });
    };
    /**
     * 添加模块
     */
    addModule = () => {
        let optype = this.props.optype;
        this.historyOptype = optype;
        if (optype === "") {
            optype = "1";
        } else if (optype === "1") {
            optype = "2";
        }
        let moduleData = {
            systypecode: "",
            moduleid: "",
            systypename: "",
            orgtypecode: "",
            appscope: "",
            isaccount: false,
            supportcloseaccbook: false,
            resid: "",
            devmodule: ""
        };
        this.historyNodeData = this.props.nodeData;
        this.props.setNodeData(moduleData);
        this.props.setIsNew(true);
        this.props.setIsEdit(true);
        this.props.setOptype(optype);
    };
    /**
     * 添加应用分类
     */
    addAppClass = () => {
        let optype = this.props.optype;
        this.historyOptype = optype;
        if (optype === "2") {
            optype = "3";
        }
        this.historyNodeData = this.props.nodeData;
        let classData = {
            apptype: 0,
            isenable: true,
            code: "",
            name: "",
            app_desc: "",
            resid: "",
            help_name: ""
        };
        this.props.setNodeData(classData);
        this.props.setIsNew(true);
        this.props.setIsEdit(true);
        this.props.setOptype(optype);
    };
    /**
     * 添加页面
     */
    addApp = () => {
        let optype = this.props.optype;
        this.historyOptype = optype;
        if (optype === "3") {
            optype = "4";
        }
        this.historyNodeData = this.props.nodeData;
        this.props.form.resetFields();
        let appData = {
            code: "",
            name: "",
            orgtypecode: "",
            funtype: "",
            app_desc: "",
            help_name: "",
            isenable: true,
            iscauserusable: false,
            uselicense_load: true,
            iscopypage: false,
            pk_group: "",
            mdidRef: { refpk: "", refname: "", refcode: "" },
            width: "1",
            height: "1",
            target_path: "",
            apptype: "1",
            fun_property: "0",
            resid: "",
            image_src: ""
        };
        this.props.setAppParamData([]);
        this.props.setNodeData(appData);
        this.props.setIsNew(true);
        this.props.setIsEdit(true);
        this.props.setOptype(optype);
    };
    /**
     * 添加页面
     */
    addPage = () => {
        let optype = this.props.optype;
        this.historyOptype = optype;
        if (optype === "4") {
            optype = "5";
        }
        this.historyNodeData = this.props.nodeData;
        let pageData = {
            pagecode: "",
            pagename: "",
            pagedesc: "",
            pageurl: "",
            resid: "",
            isdefault: false,
            iscarddefault: false
        };
        this.props.setPageButtonData([]);
        this.props.setPageTemplateData([]);
        this.props.setNodeData(pageData);
        this.props.setIsNew(true);
        this.props.setIsEdit(true);
        this.props.setOptype(optype);
    };
    /**
     * 保存
     */
    save = () => {
        let fromData = this.props.form.getFieldsValue();
        if (this.props.nodeData.children) {
            delete this.props.nodeData.children;
        }
        fromData = { ...this.props.nodeData, ...fromData };
        let { id, code } = this.props.nodeInfo;
        let optype = this.props.optype;
        let langJson = this.props.langJson;
        //  新增保存回调
        let newSaveFun = data => {
            let expandedKeys = this.props.expandedKeys;
            let id, code, name, parentId;
            if (optype === "1" || optype === "2") {
                if (data.parentcode) {
                    expandedKeys.push(data.parentcode);
                }
                id = data.moduleid;
                code = data.systypecode;
                name = data.systypename;
                parentId = data.parentcode;
                this.props.setExpandedKeys(expandedKeys);
                this.props.setSelectedKeys([data.moduleid]);
            }
            if (optype === "3") {
                id = data.pk_appregister;
                code = data.code;
                name = data.name;
                parentId = data.parent_id;
                expandedKeys.push(data.parent_id);
                this.props.setExpandedKeys(expandedKeys);
                this.props.setSelectedKeys([data.pk_appregister]);
            }
            if (optype === "4") {
                id = data.pk_appregister;
                code = data.code;
                name = data.name;
                parentId = data.parent_id;
                expandedKeys.push(data.parent_id);
                this.props.setExpandedKeys(expandedKeys);
                this.props.setSelectedKeys([data.code]);
            }
            if (optype === "5") {
                id = data.pk_apppage;
                code = data.pagecode;
                name = data.pagename;
                parentId = data.parent_id;
                expandedKeys.push(data.parentcode);
                this.props.setExpandedKeys(expandedKeys);
                this.props.setSelectedKeys([data.pk_apppage]);
            }
            this.reqTreeData();
            this.props.setNodeInfo({
                id,
                code,
                name,
                parentId,
                isleaf: true
            });
            this.props.setNodeData(data);
            this.props.setIsNew(false);
            this.props.setIsEdit(false);
            Notice({ status: "success" });
        };
        //  对应树节点前两层 模块编辑保存成功回调
        let moduleEditFun = data => {
            this.reqTreeData();
            Notice({ status: "success", msg: data.msg });
            this.props.setNodeData(fromData);
            this.props.setIsNew(false);
            this.props.setIsEdit(false);
        };
        //  对应树节点中间两层 应用分类 及 应用编辑后保存
        let appEditFun = data => {
            this.reqTreeData();
            Notice({ status: "success", msg: data.msg });
            this.props.setNodeData(fromData);
            this.props.setIsNew(false);
            this.props.setIsEdit(false);
        };
        //  对应树节点中间两层 应用分类 及 应用编辑后保存
        let pageEditFun = data => {
            this.reqTreeData();
            Notice({ status: "success", msg: data.msg });
            this.props.setNodeData(fromData);
            this.props.setIsNew(false);
            this.props.setIsEdit(false);
        };
        if (this.props.isNew) {
            if (optype === "1" || optype === "2") {
                if (id !== "00" && id.length > 0) {
                    fromData.parentcode = id;
                }
                this.reqTreeNodeData(
                    {
                        name: langCheck(
                            "102202APP-000074",
                            "pages",
                            langJson
                        ) /* 国际化处理： 应用注册*/,
                        action: langCheck(
                            "102202APP-000075",
                            "pages",
                            langJson
                        ) /* 国际化处理： 模块新增*/
                    },
                    `/nccloud/platform/appregister/insertmodule.do`,
                    fromData,
                    newSaveFun
                );
            }
            if (optype === "3" || optype === "4") {
                if (id.length > 0) {
                    fromData.parent_id = id;
                }
                // 将元数据id参照的refpk 赋给 mdid 字段
                if (fromData.hasOwnProperty("mdid")) {
                    fromData.mdid = fromData.mdidRef.refpk;
                }
                this.reqTreeNodeData(
                    {
                        name: langCheck(
                            "102202APP-000074",
                            "pages",
                            langJson
                        ) /* 国际化处理： 应用注册*/,
                        action: langCheck(
                            "102202APP-000076",
                            "pages",
                            langJson
                        ) /* 国际化处理： 应用新增*/
                    },
                    `/nccloud/platform/appregister/insertapp.do`,
                    fromData,
                    newSaveFun
                );
            }
            if (optype === "5") {
                if (id.length > 0) {
                    fromData.parent_id = id;
                    fromData.parentcode = code;
                }
                this.reqTreeNodeData(
                    {
                        name: langCheck(
                            "102202APP-000074",
                            "pages",
                            langJson
                        ) /* 国际化处理： 应用注册*/,
                        action: langCheck(
                            "102202APP-000077",
                            "pages",
                            langJson
                        ) /* 国际化处理： 页面新增*/
                    },
                    `/nccloud/platform/appregister/insertpage.do`,
                    fromData,
                    newSaveFun
                );
            }
        } else {
            if (optype === "1" || optype === "2") {
                this.reqTreeNodeData(
                    {
                        name: langCheck(
                            "102202APP-000074",
                            "pages",
                            langJson
                        ) /* 国际化处理： 应用注册*/,
                        action: langCheck(
                            "102202APP-000078",
                            "pages",
                            langJson
                        ) /* 国际化处理： 模块编辑*/
                    },
                    `/nccloud/platform/appregister/editmodule.do`,
                    fromData,
                    moduleEditFun
                );
            }
            if (optype === "3" || optype === "4") {
                // 将元数据id参照的refpk 赋给 mdid 字段
                if (fromData.hasOwnProperty("mdid")) {
                    fromData.mdid = fromData.mdidRef.refpk;
                }
                this.reqTreeNodeData(
                    {
                        name: langCheck(
                            "102202APP-000074",
                            "pages",
                            langJson
                        ) /* 国际化处理： 应用注册*/,
                        action: langCheck(
                            "102202APP-000079",
                            "pages",
                            langJson
                        ) /* 国际化处理： 应用编辑*/
                    },
                    `/nccloud/platform/appregister/editapp.do`,
                    fromData,
                    appEditFun
                );
            }
            if (optype === "5") {
                this.reqTreeNodeData(
                    {
                        name: langCheck(
                            "102202APP-000074",
                            "pages",
                            langJson
                        ) /* 国际化处理： 应用注册*/,
                        action: langCheck(
                            "102202APP-000080",
                            "pages",
                            langJson
                        ) /* 国际化处理： 页面编辑*/
                    },
                    `/nccloud/platform/appregister/editpage.do`,
                    fromData,
                    pageEditFun
                );
            }
        }
    };
    /**
     * 删除
     */
    del = () => {
        if (!this.props.nodeInfo.isleaf) {
            Notice({
                status: "warning",
                msg: langCheck(
                    "102202APP-000081",
                    "pages",
                    this.props.langJson
                ) /* 国际化处理： 请先删除当前节点下的内容！*/
            });
            return;
        }
        DelPrompts(() => {
            let optype = this.props.optype;
            let { id } = this.props.nodeInfo;
            let delFun = data => {
                Notice({
                    status: "success",
                    msg: data.true
                });
                this.reqTreeData();
                this.props.setNodeData({});
                this.props.setSelectedKeys(["00"]);
                this.props.setOptype("");
            };
            if (optype === "1" || optype === "2") {
                this.reqTreeNodeData(
                    {
                        name: langCheck(
                            "102202APP-000074",
                            "pages",
                            this.props.langJson
                        ) /* 国际化处理： 应用注册*/,
                        action: langCheck(
                            "102202APP-000082",
                            "pages",
                            this.props.langJson
                        ) /* 国际化处理： 模块删除*/
                    },
                    `/nccloud/platform/appregister/deletemodule.do`,
                    {
                        moduleid: id
                    },
                    delFun
                );
            }
            if (optype === "3" || optype === "4") {
                this.reqTreeNodeData(
                    {
                        name: langCheck(
                            "102202APP-000074",
                            "pages",
                            this.props.langJson
                        ) /* 国际化处理： 应用注册*/,
                        action: langCheck(
                            "102202APP-000083",
                            "pages",
                            this.props.langJson
                        ) /* 国际化处理： 应用删除*/
                    },
                    `/nccloud/platform/appregister/deleteapp.do`,
                    {
                        pk_appregister: id
                    },
                    delFun
                );
            }
            if (optype === "5") {
                this.reqTreeNodeData(
                    {
                        name: langCheck(
                            "102202APP-000074",
                            "pages",
                            this.props.langJson
                        ) /* 国际化处理： 应用注册*/,
                        action: langCheck(
                            "102202APP-000084",
                            "pages",
                            this.props.langJson
                        ) /* 国际化处理： 页面删除*/
                    },
                    `/nccloud/platform/appregister/deletepage.do`,
                    {
                        pk_apppage: id
                    },
                    delFun
                );
            }
        });
    };
    /**
     * 右侧表单选择
     */
    switchFrom = () => {
        switch (this.props.optype) {
            // 对应树结构中的第一层
            case "1":
                return <ModuleFormCard form={this.props.form} />;
            // 对应树结构中的第二层;
            case "2":
                return <ModuleFormCard form={this.props.form} />;
            // 对应树结构的第三层
            case "3":
                return <ClassFormCard form={this.props.form} />;
            // 对应树结构的第四层
            case "4":
                return <AppFormCard form={this.props.form} />;
            // 对应树结构的第五层
            case "5":
                return <PageFromCard form={this.props.form} />;
            default:
                return "";
        }
    };
    /**
     * tree 数据请求
     * @param {Function} callback 页面初始化设置默认树节点选中
     */
    reqTreeData = callback => {
        Ajax({
            url: `/nccloud/platform/appregister/querymodules.do`,
            info: {
                name: langCheck(
                    "102202APP-000085",
                    "pages",
                    this.props.langJson
                ) /* 国际化处理： 应用注册模块*/,
                action: langCheck(
                    "102202APP-000022",
                    "pages",
                    this.props.langJson
                ) /* 国际化处理： 查询*/
            },
            success: ({ data }) => {
                if (data.success && data.data.length > 0) {
                    this.props.setTreeData(data.data);
                    if (callback) {
                        callback();
                    }
                }
            }
        });
    };
    /**
     * 树节点详细信息请求
     * @param {Object} info 接口描述
     * @param {String} url 请求地址
     * @param {Object} data 请求数据
     * @param {Function} callback 成功回调
     */
    reqTreeNodeData = (info, url, data, callback) => {
        Ajax({
            url,
            data,
            info,
            success: ({ data: { data } }) => {
                if (data) {
                    callback(data);
                }
            }
        });
    };
    /**
     * 数据点选择事件
     * @param {Object} obj 选中的数节点对象
     */
    handleTreeNodeSelect = (obj, selectedKey) => {
        if (this.treeNodeChange()) {
            return;
        }
        let optype = "";
        let id;
        let nodeInfo = {
            id: "",
            code: "",
            name: "",
            parentId: "",
            isleaf: false
        };
        if (obj) {
            switch (obj.flag) {
                // 对应树的第一层
                case "0":
                    id = obj.moduleid;
                    let appFieldCallBack = data => {
                        this.props.setNodeData(data);
                    };
                    this.reqTreeNodeData(
                        {
                            name: langCheck(
                                "102202APP-000074",
                                "pages",
                                this.props.langJson
                            ),
                            action: langCheck(
                                "102202APP-000086",
                                "pages",
                                this.props.langJson
                            )
                        } /* 国际化处理： 应用注册,应用查询*/,
                        `/nccloud/platform/appregister/querymodule.do`,
                        { moduleid: id },
                        appFieldCallBack
                    );
                    optype = "1";
                    break;
                // 对应树的第二层
                case "1":
                    id = obj.moduleid;
                    let appModuleCallBack = data => {
                        this.props.setNodeData(data);
                    };
                    this.reqTreeNodeData(
                        {
                            name: langCheck(
                                "102202APP-000074",
                                "pages",
                                this.props.langJson
                            ),
                            action: langCheck(
                                "102202APP-000086",
                                "pages",
                                this.props.langJson
                            )
                        } /* 国际化处理： 应用注册,应用查询*/,
                        `/nccloud/platform/appregister/querymodule.do`,
                        { moduleid: id },
                        appModuleCallBack
                    );
                    optype = "2";
                    break;
                // 对应树的第三层
                case "2":
                    let appClassCallBack = data => {
                        this.props.setNodeData(data.appRegisterVO);
                        this.props.setAppParamData(data.appParamVOs);
                    };
                    this.reqTreeNodeData(
                        {
                            name: langCheck(
                                "102202APP-000074",
                                "pages",
                                this.props.langJson
                            ),
                            action: langCheck(
                                "102202APP-000086",
                                "pages",
                                this.props.langJson
                            )
                        } /* 国际化处理： 应用注册,应用查询*/,
                        `/nccloud/platform/appregister/queryapp.do`,
                        { pk_appregister: obj.moduleid },
                        appClassCallBack
                    );
                    id = obj.moduleid;
                    optype = "3";
                    break;
                // 对应树的第四层
                case "3":
                    let appCallBack = data => {
                        this.props.setNodeData(data.appRegisterVO);
                        this.props.setAppParamData(data.appParamVOs);
                        this.props.form.resetFields();
                    };
                    this.reqTreeNodeData(
                        {
                            name: langCheck(
                                "102202APP-000074",
                                "pages",
                                this.props.langJson
                            ),
                            action: langCheck(
                                "102202APP-000086",
                                "pages",
                                this.props.langJson
                            )
                        } /* 国际化处理： 应用注册,应用查询*/,
                        `/nccloud/platform/appregister/queryapp.do`,
                        { pk_appregister: obj.def1 },
                        appCallBack
                    );
                    id = obj.def1;
                    optype = "4";
                    break;
                // 对应树的第五层
                case "4":
                    let pageCallBack = data => {
                        let { parent_id } = data.apppageVO;
                        this.props.setNodeInfo({
                            ...this.props.nodeInfo,
                            parentId: parent_id
                        });
                        this.props.setNodeData(data.apppageVO);
                        this.props.setPageButtonData(
                            data.appButtonVOs ? data.appButtonVOs : []
                        );
                        this.props.setPageTemplateData(
                            data.pageTemplets ? data.pageTemplets : []
                        );
                    };
                    this.reqTreeNodeData(
                        {
                            name: langCheck(
                                "102202APP-000074",
                                "pages",
                                this.props.langJson
                            ),
                            action: langCheck(
                                "102202APP-000087",
                                "pages",
                                this.props.langJson
                            )
                        } /* 国际化处理： 应用注册,应用页面查询*/,
                        `/nccloud/platform/appregister/querypagedetail.do`,
                        { pk_apppage: obj.moduleid },
                        pageCallBack
                    );
                    id = obj.moduleid;
                    optype = "5";
                    break;
                default:
                    break;
            }
            if (obj.moduleid !== "00") {
                nodeInfo = {
                    id,
                    code: obj.systypecode,
                    name: obj.name,
                    parentId: obj.parentcode,
                    isleaf:
                        (obj.children && obj.children.length === 0) ||
                        obj.isleaf
                };
            }
        }
        this.props.setIsNew(false);
        this.props.setIsEdit(false);
        this.props.setNodeInfo(nodeInfo);
        this.props.setOptype(optype);
        this.props.setSelectedKeys(selectedKey);
    };
    /**
     * 更新树数组
     * @param {Object} obj  需要更新的树节点
     */
    updateTreeData = obj => {
        let treeDataArray = this.props.treeData;
        treeDataArray = treeDataArray.map(item => {
            if (item.moduleid === obj.moduleid) {
                item = obj;
            }
            return item;
        });
        this.props.setTreeData(treeDataArray);
    };
    /**
     * 树查询
     */
    handleTreeSearch = value => {
        let searchCallback = data => {
            if (value.length > 0) {
                let expandedKeys = data.map(item => item.moduleid);
                this.props.setExpandedKeys(expandedKeys);
            } else {
                this.props.setExpandedKeys(["00"]);
            }
            this.props.setTreeData(data);
        };
        /**
         * 延迟请求
         */
        DeferFn(() => {
            this.reqTreeNodeData(
                {
                    name: langCheck(
                        "102202APP-000074",
                        "pages",
                        this.props.langJson
                    ),
                    action: langCheck(
                        "102202APP-000086",
                        "pages",
                        this.props.langJson
                    )
                } /* 国际化处理： 应用注册,应用查询*/,
                `/nccloud/platform/appregister/searchapps.do`,
                { search_content: value },
                searchCallback
            );
        });
    };
    /**
     * 树节点切换校验
     *
     */
    treeNodeChange = () => {
        let flag = true;
        if (this.props.isEdit) {
            SavePrompts(() => {
                this.handleClick("save");
                flag = false;
            });
        } else {
            flag = false;
        }
        return flag;
    };
    /**
     * 初始化树选择
     */
    initTreeSelected = () => {
        let {
            selectedKeys,
            setSelectedKeys,
            optype,
            setOptype,
            treeData,
            nodeInfo
        } = this.props;
        if (optype !== "") {
            setSelectedKeys(selectedKeys);
            setOptype(optype);
            let historyNode = treeData.find(
                item => item.moduleid === nodeInfo.id
            );
            this.handleTreeNodeSelect(historyNode, selectedKeys);
        } else {
            if (treeData.length > 0) {
                let treeNode = treeData[0];
                let treeSelectedKeys = new Array(treeNode.moduleid);
                setSelectedKeys(treeSelectedKeys);
                setOptype("1");
                this.handleTreeNodeSelect(treeNode, treeSelectedKeys);
            } else {
                setSelectedKeys(["00"]);
                setOptype("");
            }
        }
    };
    componentDidMount() {
        getMulti({
            moduleId: "AppRegister",
            domainName: "workbench",
            callback: json => {
                this.props.setLangJson(json);
                this.reqTreeData(this.initTreeSelected);
            }
        });
    }
    render() {
        let optype = this.props.optype;
        let isEdit = this.props.isEdit;
        let nodeData = this.props.nodeData;
        let langJson = this.props.langJson;
        let btnList = [
            {
                code: "addModule",
                name: langCheck(
                    "102202APP-000088",
                    "pages",
                    langJson
                ) /* 国际化处理： 增加模块*/,
                type: "primary",
                group: true,
                isshow: !isEdit && (optype === "" || optype === "1")
            },
            {
                code: "addAppClass",
                name: langCheck(
                    "102202APP-000089",
                    "pages",
                    langJson
                ) /* 国际化处理： 增加应用分类*/,
                type: "primary",
                group: true,
                isshow: !isEdit && optype === "2"
            },
            {
                code: "addApp",
                name: langCheck(
                    "102202APP-000090",
                    "pages",
                    langJson
                ) /* 国际化处理： 增加应用*/,
                type: "primary",
                group: true,
                isshow: !isEdit && optype === "3"
            },
            {
                code: "exportApp",
                name: langCheck(
                    "102202APP-000091",
                    "pages",
                    langJson
                ) /* 国际化处理： 导出该应用下所有页面模板多语*/,
                type: "primary",
                group: false,
                isshow:
                    !isEdit &&
                    optype === "4" &&
                    nodeData &&
                    nodeData.apptype === "1"
            },
            {
                code: "addPage",
                name: langCheck(
                    "102202APP-000092",
                    "pages",
                    langJson
                ) /* 国际化处理： 增加页面*/,
                type: "primary",
                group: true,
                isshow:
                    !isEdit &&
                    optype === "4" &&
                    nodeData &&
                    nodeData.apptype === "1"
            },
            {
                code: "save",
                name: langCheck(
                    "102202APP-000069",
                    "pages",
                    langJson
                ) /* 国际化处理： 保存*/,
                type: "primary",
                isshow: isEdit
            },
            {
                code: "cancel",
                name: langCheck(
                    "102202APP-000064",
                    "pages",
                    langJson
                ) /* 国际化处理： 取消*/,
                type: "",
                isshow: isEdit
            },
            {
                code: "edit",
                name: langCheck(
                    "102202APP-000093",
                    "pages",
                    langJson
                ) /* 国际化处理： 修改*/,
                type: "",
                group: true,
                isshow: !isEdit && optype !== ""
            },
            {
                code: "del",
                name: langCheck(
                    "102202APP-000053",
                    "pages",
                    langJson
                ) /* 国际化处理： 删除*/,
                type: "",
                group: true,
                isshow: !isEdit && optype !== ""
            }
        ];
        return (
            <PageLayout
                className="nc-workbench-appRegister"
                header={
                    <PageLayoutHeader>
                        <div>
                            {langCheck("102202APP-000074", "pages", langJson)}
                        </div>
                        {/* 国际化处理： 应用注册*/}
                        <div
                            style={{
                                display: "flex",
                                "justify-content": "flex-start",
                                "align-items": "center"
                            }}
                        >
                            {/* 开发态 模板多语抽取入口按钮 ----开始 */}
                            <ExportAppBtn
                                isShow={
                                    !isEdit &&
                                    optype === "4" &&
                                    nodeData &&
                                    nodeData.apptype === "1"
                                }
                                multiData={langJson}
                            />
                            {/* 开发态 模板多语抽取入口按钮 ----结束 */}
                            <ButtonCreate
                                dataSource={btnList}
                                onClick={this.handleClick}
                            />
                        </div>
                    </PageLayoutHeader>
                }
            >
                <PageLayoutLeft>
                    <SearchTree
                        className="appRegister-searchTree"
                        onSelect={this.handleTreeNodeSelect}
                        onSearch={this.handleTreeSearch}
                    />
                </PageLayoutLeft>
                <PageLayoutRight className="workbench-auto-scroll">
                    {this.switchFrom()}
                </PageLayoutRight>
            </PageLayout>
        );
    }
}
AppRegister.propTypes = {
    isNew: PropTypes.bool.isRequired,
    isEdit: PropTypes.bool.isRequired,
    nodeInfo: PropTypes.object.isRequired,
    nodeData: PropTypes.object.isRequired,
    treeData: PropTypes.array.isRequired,
    setTreeData: PropTypes.func.isRequired,
    setNodeData: PropTypes.func.isRequired,
    setPageButtonData: PropTypes.func.isRequired,
    setPageTemplateData: PropTypes.func.isRequired,
    setAppParamData: PropTypes.func.isRequired,
    setIsNew: PropTypes.func.isRequired,
    setIsEdit: PropTypes.func.isRequired,
    setExpandedKeys: PropTypes.func.isRequired,
    setSelectedKeys: PropTypes.func.isRequired,
    optype: PropTypes.string.isRequired,
    setOptype: PropTypes.func.isRequired,
    selectedKeys: PropTypes.array.isRequired,
    expandedKeys: PropTypes.array.isRequired
};
AppRegister = Form.create()(AppRegister);
export default connect(
    state => ({
        nodeData: state.AppRegisterData.nodeData,
        nodeInfo: state.AppRegisterData.nodeInfo,
        treeData: state.AppRegisterData.treeData,
        isNew: state.AppRegisterData.isNew,
        isEdit: state.AppRegisterData.isEdit,
        selectedKeys: state.AppRegisterData.selectedKeys,
        expandedKeys: state.AppRegisterData.expandedKeys,
        optype: state.AppRegisterData.optype,
        langJson: state.AppRegisterData.langJson
    }),
    {
        setTreeData,
        setNodeData,
        setNodeInfo,
        setPageButtonData,
        setPageTemplateData,
        setAppParamData,
        setIsNew,
        setIsEdit,
        setExpandedKeys,
        setSelectedKeys,
        setOptype,
        setLangJson
    }
)(AppRegister);
