import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import _ from "lodash";
import { Form } from "antd";
import {
    PageLayout,
    PageLayoutHeader,
    PageLayoutLeft,
    PageLayoutRight
} from "Components/PageLayout";
import { updateLangMulti } from "Store/MenuRegister/action";
import { FormContent, dataDefaults } from "Components/FormCreate";
import Ajax from "Pub/js/ajax.js";
import { GetQuery, Pad, DeferFn } from "Pub/js/utils.js";
import TreeSearch from "./TreeSearch";
import ButtonCreate from "Components/ButtonCreate";
import Notice from "Components/Notice";
import {
    DelPrompts,
    SavePrompts,
    CancelPrompts
} from "Components/EventPrompts";
import { getMulti } from "Pub/js/getMulti";
import { langCheck } from "Pub/js/utils";
import "./index.less";

class MenuItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            id: "",
            mt: "",
            mn: "",
            parentKey: "",
            isedit: false,
            isNew: false,
            expandedKeys: ["00"],
            selectedKeys: ["00"],
            treeData: [],
            fields: {},
            formData: {
                menuitemcode: "",
                menuitemname: "",
                menudes: "",
                appcodeRef: {},
                resid: ""
            }
        };
        this.newFormData = {
            menuitemcode: "",
            menuitemname: "",
            menudes: "",
            appcodeRef: {},
            resid: ""
        };
        this.historyData;
    }
    /**
     * 按钮点击事件
     */
    handleBtnClick = key => {
        switch (key) {
            case "add":
                this.add();
                break;
            case "edit":
                let formData = this.props.form.getFieldsValue();
                this.historyData = { ...this.state.fields, ...formData };
                this.setState({
                    isedit: true,
                    formData,
                    fields: this.historyData
                });
                break;
            case "save":
                this.save();
                break;
            case "cancle":
                CancelPrompts(() => {
                    this.props.form.resetFields();
                    this.setState({
                        isedit: false,
                        isNew: false,
                        fields: { ...this.historyData },
                        formData: {
                            menuitemcode: this.historyData.menuitemcode,
                            menuitemname: this.historyData.menuitemname,
                            appcodeRef: this.historyData.appcodeRef,
                            menudes: this.historyData.menudes,
                            resid: this.historyData.resid
                        }
                    });
                });
                break;
            case "del":
                this.del();
                break;
            default:
                break;
        }
    };
    /**
     * 新增事件
     */
    add = () => {
        let fields = this.state.fields;
        let newCode;
        if (this.state.parentKey === "" || this.state.parentKey === "00") {
            let treeArrayData = this.state.treeData.filter(
                item => item.menuitemcode.length === 2
            );
            newCode = `${treeArrayData[treeArrayData.length - 1][
                "menuitemcode"
            ] -
                0 +
                1}`;
        } else {
            let fieldsChildren = fields.children;
            if (!fieldsChildren || fieldsChildren.length === 0) {
                let fieldsItem = fields;
                newCode = fieldsItem["menuitemcode"]
                    ? fieldsItem["menuitemcode"] + "01"
                    : "01";
            } else {
                newCode = `${fieldsChildren[fieldsChildren.length - 1][
                    "menuitemcode"
                ] -
                    0 +
                    1}`;
                newCode = Pad(
                    newCode,
                    fieldsChildren[fieldsChildren.length - 1]["menuitemcode"]
                        .length
                );
            }
        }
        this.setState({
            isedit: true,
            isNew: true,
            fields: {
                pk_menu: this.state.id,
                menuitemcode: newCode,
                menuitemname: "",
                menudes: "",
                resid: "",
                appcodeRef: {
                    refcode: "",
                    refname: "",
                    refpk: ""
                }
            },
            formData: {
                menuitemcode: "",
                menuitemname: "",
                menudes: "",
                resid: "",
                appcodeRef: {
                    refcode: "",
                    refname: "",
                    refpk: ""
                }
            }
        });
    };
    /**
     * 保存事件
     */
    save = () => {
        let langMultiData = this.props.langMultiData;
        let { fields, isNew, parentKey } = this.state;
        this.props.form.validateFields(errors => {
            if (!errors) {
                let newFieldsData = this.props.form.getFieldsValue();
                let newFields = { ...fields, ...newFieldsData };
                let {
                    appcodeRef,
                    pk_menuitem,
                    menuitemcode,
                    menuitemname,
                    menudes,
                    pk_menu,
                    parentcode,
                    resid
                } = newFields;
                let resData, urlData;
                if (isNew) {
                    if (parentKey === "" || parentKey === "00") {
                        resData = {
                            menuitemcode,
                            menuitemname,
                            menudes,
                            pk_menu,
                            resid
                        };
                    } else {
                        resData = {
                            menuitemcode,
                            menuitemname,
                            menudes,
                            pk_menu,
                            parentcode: parentKey,
                            resid
                        };
                    }
                    urlData = `/nccloud/platform/appregister/insertappmenuitem.do`;
                    if (fields.appcodeRef) {
                        resData.appcode = appcodeRef.refcode;
                        resData.appid = appcodeRef.refpk;
                    }
                } else {
                    urlData = `/nccloud/platform/appregister/editappmenuitem.do`;
                    resData = {
                        pk_menuitem,
                        menuitemcode,
                        menuitemname,
                        menudes,
                        pk_menu,
                        parentcode,
                        resid
                    };
                    if (fields.appcodeRef) {
                        resData.appcode = appcodeRef.refcode;
                        resData.appid = appcodeRef.refpk;
                    }
                }
                Ajax({
                    url: urlData,
                    data: resData,
                    info: {
                        name: langCheck(
                            "102202MENU-000000",
                            true,
                            langMultiData
                        ) /* 国际化处理： 菜单注册菜单项*/,
                        action: langCheck(
                            "102202MENU-000001",
                            true,
                            langMultiData
                        ) /* 国际化处理： 保存*/
                    },
                    success: ({ data: { data } }) => {
                        if (data) {
                            let treeData = [...this.state.treeData];
                            let newFields;
                            if (isNew) {
                                treeData = _.concat(treeData, data);
                                newFields = data;
                            } else {
                                data.map(newItem => {
                                    let dataIndex = _.findIndex(
                                        treeData,
                                        item =>
                                            item.pk_menuitem ===
                                            newItem.pk_menuitem
                                    );
                                    treeData[dataIndex] = newItem;
                                });
                                newFields = data.find(
                                    item =>
                                        item.pk_menuitem === resData.pk_menuitem
                                );
                            }
                            this.setState(
                                {
                                    isedit: false,
                                    isNew: false,
                                    treeData,
                                    fields: newFields
                                },
                                () => {
                                    this.setSelectedKeys([
                                        newFields.menuitemcode
                                    ]);
                                    if (newFields.parentcode) {
                                        this.setExpandedKeys([
                                            newFields.parentcode
                                        ]);
                                    }
                                }
                            );
                            Notice({
                                status: "success",
                                msg: data.msg
                            });
                        }
                    }
                });
            }
        });
    };
    /**
     * 删除事件
     */
    del = () => {
        let langMultiData = this.props.langMultiData;
        DelPrompts(() => {
            let fields = this.state.fields;
            let hasArray = this.state.treeData.filter(
                item => item.parentcode == fields.menuitemcode
            );
            if (hasArray && hasArray.length > 0) {
                Notice({
                    status: "warning",
                    msg: langCheck(
                        "102202MENU-000038",
                        true,
                        langMultiData
                    ) /* 国际化处理： 不是叶子节点不能删除！*/
                });
                return;
            }
            Ajax({
                url: `/nccloud/platform/appregister/deleteappmenuitem.do`,
                data: {
                    pk_menuitem: fields.pk_menuitem
                },
                info: {
                    name: langCheck(
                        "102202MENU-000000",
                        true,
                        langMultiData
                    ) /* 国际化处理： 菜单注册菜单项*/,
                    action: langCheck(
                        "102202MENU-000029",
                        true,
                        langMultiData
                    ) /* 国际化处理： 删除*/
                },
                success: ({ data: { data } }) => {
                    if (data) {
                        let treeData = this.state.treeData;
                        _.remove(
                            treeData,
                            item => item.pk_menuitem === fields.pk_menuitem
                        );
                        this.setState({
                            isedit: false,
                            isNew: false,
                            treeData,
                            parentKey: ""
                        });
                        Notice({
                            status: "success",
                            msg: data.true
                        });
                    }
                }
            });
        });
    };
    /**
     * 树查询
     */
    handleSearch = (value, callback) => {
        let langMultiData = this.props.langMultiData;
        // 延迟请求
        DeferFn(() => {
            Ajax({
                url: `/nccloud/platform/appregister/searchappmenuitem.do`,
                data: {
                    search_content: value,
                    pk_menu: this.state.id
                },
                info: {
                    name: langCheck(
                        "102202MENU-000030",
                        true,
                        langMultiData
                    ) /* 国际化处理： 菜单项*/,
                    action: langCheck(
                        "102202MENU-000039",
                        true,
                        langMultiData
                    ) /* 国际化处理： 查询应用树*/
                },
                success: res => {
                    let { success, data } = res.data;
                    if (success && data) {
                        this.setState(
                            {
                                treeData: data
                            },
                            () => {
                                callback(data);
                            }
                        );
                    }
                }
            });
        });
    };
    /**
     * 设置树展开节点
     * @param {Array} expandedKeys 展开的树节点数组
     */
    setExpandedKeys = expandedKeys => {
        if (expandedKeys.length === 1) {
            expandedKeys = expandedKeys.concat(this.state.expandedKeys);
        }
        expandedKeys = Array.from(new Set(expandedKeys));
        this.setState({
            expandedKeys
        });
    };
    /**
     * 设置树选中节点
     * @param {Array} selectedKeys 选中的树节点数组
     */
    setSelectedKeys = selectedKeys => {
        if (this.treeNodeChange()) {
            return;
        }
        let selectedKey = selectedKeys[0];
        if (selectedKey === "00" || selectedKey === undefined) {
            this.setState({
                selectedKeys,
                isedit: false,
                isNew: false,
                parentKey: "",
                fields: this.newFormData,
                formData: { ...this.newFormData }
            });
            return;
        }
        let treeData = this.state.treeData;
        let treeItem = treeData.find(item => item.menuitemcode === selectedKey);
        // 防止选中应用的应用编码被修改 参照报错
        if (!treeItem.appcodeRef) {
            treeItem.appcodeRef = {
                refcode: "",
                refname: "",
                refpk: ""
            };
        }
        this.historyData = { ...treeItem };
        this.setState({
            selectedKeys,
            isedit: false,
            parentKey: selectedKey,
            fields: { ...treeItem },
            formData: {
                menuitemcode: treeItem.menuitemcode,
                menuitemname: treeItem.menuitemname,
                appcodeRef: treeItem.appcodeRef,
                resid: treeItem.resid,
                menudes: treeItem.menudes
            }
        });
    };
    /**
     * 树节点切换校验
     *
     */
    treeNodeChange = () => {
        let flag = true;
        if (this.state.isedit) {
            SavePrompts(() => {
                this.handleBtnClick("save");
                flag = false;
            });
        } else {
            flag = false;
        }
        return flag;
    };
    /**
     * 页面跳转
     */
    pageBack = () => {
        window.history.back(-1);
    };
    componentWillMount() {
        let { id, mn, mt } = GetQuery(this.props.location.search);
        this.setState({ id, mn: mn && mn != "null" ? mn : "", mt: mt - 0 });
    }
    componentDidMount() {
        let langMultiData = this.props.langMultiData;
        if (!langMultiData["102202MENU-000000"]) {
            getMulti({
                moduleId: "102202MENU",
                // currentLocale: 'zh-CN',
                domainName: "workbench",
                callback: json => {
                    this.props.updateLangMulti(json);
                }
            });
        }
        Ajax({
            url: `/nccloud/platform/appregister/queryappmenus.do`,
            data: {
                pk_menu: this.state.id
            },
            info: {
                name: langCheck(
                    "102202MENU-000030",
                    true,
                    langMultiData
                ) /* 国际化处理： 菜单项*/,
                action: langCheck(
                    "102202MENU-000039",
                    true,
                    langMultiData
                ) /* 国际化处理： 查询应用树*/
            },
            success: res => {
                let { success, data } = res.data;
                if (success && data) {
                    this.setState(
                        {
                            treeData: data
                        },
                        () => {
                            if (data.length > 0) {
                                let menuitemcode = data[0].menuitemcode;
                                this.setSelectedKeys([menuitemcode]);
                            }
                        }
                    );
                }
            }
        });
    }
    render() {
        let langMultiData = this.props.langMultiData;
        let {
            treeData,
            mn,
            mt,
            isedit,
            isNew,
            fields,
            expandedKeys,
            selectedKeys,
            parentKey
        } = this.state;
        let {
            menuitemcode,
            menuitemname,
            appcodeRef,
            resid,
            menudes
        } = this.state.formData;
        let lenCheck = undefined;
        if (isNew) {
            if (parentKey.length < 6) {
                lenCheck = parentKey.length + 2;
            }
        } else {
            if (menuitemcode.length < 6) {
                lenCheck = menuitemcode.length;
            }
        }
        let menuFormData = [
            {
                code: "menuitemcode",
                type: "string",
                label: langCheck(
                    "102202MENU-000040",
                    true,
                    langMultiData
                ) /* 国际化处理： 菜单项编码*/,
                isRequired: true,
                isedit: isedit,
                initialValue: menuitemcode,
                len: lenCheck,
                xs: 24,
                md: 12,
                lg: 12
            },
            {
                code: "menuitemname",
                type: "string",
                label: langCheck(
                    "102202MENU-000041",
                    true,
                    langMultiData
                ) /* 国际化处理： 菜单项名称*/,
                isRequired: true,
                isedit: isedit,
                initialValue: menuitemname,
                xs: 24,
                md: 12,
                lg: 12
            },
            {
                type: "refer",
                code: "appcodeRef",
                label: langCheck(
                    "102202MENU-000042",
                    true,
                    langMultiData
                ) /* 国际化处理： 关联应用编码*/,
                initialValue: appcodeRef,
                options: {
                    placeholder: "",
                    refName: langCheck(
                        "102202MENU-000042",
                        true,
                        langMultiData
                    ) /* 国际化处理： 关联应用编码*/,
                    refCode: "appcodeRef",
                    refType: "tree",
                    isTreelazyLoad: false,
                    onlyLeafCanSelect: true,
                    queryTreeUrl: "/nccloud/platform/appregister/appregref.do",
                    disabled:
                        this.state.fields.menuitemcode &&
                        this.state.fields.menuitemcode.length < 8 &&
                        isedit,
                    columnConfig: [
                        {
                            name: [
                                langCheck(
                                    "102202MENU-000044",
                                    true,
                                    langMultiData
                                ),
                                langCheck(
                                    "102202MENU-000045",
                                    true,
                                    langMultiData
                                )
                            ] /* 国际化处理： 编码,名称*/,
                            code: ["refcode", "refname"]
                        }
                    ],
                    isMultiSelectedEnabled: false
                },
                isedit: isedit,
                xs: 24,
                md: 12,
                lg: 12
            },
            {
                code: "resid",
                type: "string",
                label: langCheck(
                    "102202MENU-000046",
                    true,
                    langMultiData
                ) /* 国际化处理： 多语字段*/,
                isRequired: false,
                isedit: isedit,
                initialValue: resid,
                xs: 24,
                md: 12,
                lg: 12
            },
            {
                code: "menudes",
                type: "string",
                label: langCheck(
                    "102202MENU-000018",
                    true,
                    langMultiData
                ) /* 国际化处理： 菜单描述*/,
                isRequired: false,
                isedit: isedit,
                initialValue: menudes,
                xs: 24,
                md: 12,
                lg: 12
            }
        ];
        let btnList = [
            {
                name: langCheck(
                    "102202MENU-000047",
                    true,
                    langMultiData
                ) /* 国际化处理： 新增*/,
                code: "add",
                type: "primary",
                group: true,
                isshow:
                    ((fields.menuitemcode && fields.menuitemcode.length < 8) ||
                        this.state.parentKey === "" ||
                        this.state.parentKey === "00") &&
                    !isedit &&
                    !mt
            },
            {
                name: langCheck(
                    "102202MENU-000000",
                    true,
                    langMultiData
                ) /* 国际化处理： 修改*/,
                code: "edit",
                type: "",
                group: true,
                isshow:
                    this.state.parentKey !== "" &&
                    this.state.parentKey !== "00" &&
                    !isedit &&
                    !mt
            },
            {
                name: langCheck(
                    "102202MENU-000029",
                    true,
                    langMultiData
                ) /* 国际化处理： 删除*/,
                code: "del",
                type: "",
                group: true,
                isshow:
                    this.state.parentKey !== "" &&
                    this.state.parentKey !== "00" &&
                    !isedit &&
                    !mt
            },
            {
                name: langCheck(
                    "102202MENU-000001",
                    true,
                    langMultiData
                ) /* 国际化处理： 保存*/,
                code: "save",
                type: "primary",
                isshow: isedit
            },
            {
                name: langCheck(
                    "102202MENU-000002",
                    true,
                    langMultiData
                ) /* 国际化处理： 取消*/,
                code: "cancle",
                type: "",
                isshow: isedit
            }
        ];
        return (
            <PageLayout
                header={
                    <PageLayoutHeader>
                        <div>
                            <i
                                className="iconfont icon-fanhuishangyiji"
                                onClick={this.pageBack}
                            />
                            {mn}
                        </div>
                        <ButtonCreate
                            dataSource={btnList}
                            onClick={this.handleBtnClick}
                        />
                    </PageLayoutHeader>
                }
                className="nc-workbench-menuitem"
            >
                <PageLayoutLeft>
                    <TreeSearch
                        setExpandedKeys={this.setExpandedKeys}
                        expandedKeys={expandedKeys}
                        setSelectedKeys={this.setSelectedKeys}
                        selectedKeys={selectedKeys}
                        onSearch={this.handleSearch}
                        dataSource={treeData}
                        langMultiData={langMultiData}
                    />
                </PageLayoutLeft>
                <PageLayoutRight className="workbench-auto-scroll">
                    <div className="nc-workbench-menuitem-form">
                        {(this.state.parentKey === "" ||
                            this.state.parentKey === "00") &&
                        !isNew ? (
                            ""
                        ) : (
                            <FormContent
                                datasources={dataDefaults(
                                    this.state.formData,
                                    menuFormData,
                                    "code"
                                )}
                                form={this.props.form}
                                formData={menuFormData}
                            />
                        )}
                    </div>
                </PageLayoutRight>
            </PageLayout>
        );
    }
}
MenuItem.propTypes = {
    menuItemData: PropTypes.object.isRequired,
    langMultiData: PropTypes.object.isRequired,
    updateLangMulti: PropTypes.func.isRequired
};
MenuItem = Form.create()(MenuItem);
export default connect(
    state => {
        return {
            menuItemData: state.menuRegisterData.menuItemData,
            langMultiData: state.menuRegisterData.langMultiData
        };
    },
    { updateLangMulti }
)(MenuItem);
