import React, { Component } from "react";
import _ from "lodash";
import { Form } from "antd";
import {
    PageLayout,
    PageLayoutHeader,
    PageLayoutLeft,
    PageLayoutRight
} from "Components/PageLayout";
import TreeCom from "./TreeCom";
import ButtonCreate from "Components/ButtonCreate";
import { FormContent, dataDefaults } from "Components/FormCreate";
import Ajax from "Pub/js/ajax.js";
import Notice from "Components/Notice";
import {
    DelPrompts,
    SavePrompts,
    CancelPrompts
} from "Components/EventPrompts";
import { getMulti } from "Pub/js/getMulti";
import { langCheck } from "Pub/js/utils";
import "./index.less";
class IndividuationRegister extends Component {
    constructor(props) {
        super(props);
        this.state = {
            treeData: [],
            fields: {},
            formData: {},
            isNew: false,
            isedit: false,
            parentKey: "",
            selectedKeys: ["00"],
            langMultiData: {}
        };
        this.newFormData = {
            code: "",
            name: "",
            resourceid: "",
            resourcepath: "",
            page_part_url: ""
        };
        this.historyData;
    }
    /**
     * 个性化注册所有按钮点击事件
     * @param {String} key 按钮code
     */
    handleBtnClick = key => {
        switch (key) {
            case "add":
                this.setState({
                    isedit: true,
                    isNew: true,
                    fields: { ...this.newFormData },
                    formData: { ...this.newFormData }
                });
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
                            code: this.historyData.code,
                            name: this.historyData.name,
                            resourceid: this.historyData.resourceid,
                            resourcepath: this.historyData.resourcepath,
                            page_part_url: this.historyData.page_part_url
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
     * 删除事件
     */
    del = () => {
        let langMultiData = this.state.langMultiData;
        DelPrompts(() => {
            let pk_individualreg = this.state.fields.pk_individualreg;
            Ajax({
                url: `/nccloud/platform/appregister/deleteindividualreg.do`,
                info: {
                    name: langCheck(
                        "1022PREGI-000001",
                        true,
                        langMultiData
                    ) /* 国际化处理： 个性化注册*/,
                    action: langCheck(
                        "1022PREGI-000002",
                        true,
                        langMultiData
                    ) /* 国际化处理： 删除*/
                },
                data: {
                    pk_individualreg
                },
                success: ({ data: { data } }) => {
                    if (data) {
                        let { treeData } = this.state;
                        treeData = [...this.state.treeData];
                        _.remove(
                            treeData,
                            item => item.pk_individualreg === pk_individualreg
                        );
                        this.setState({
                            treeData,
                            parentKey: "",
                            selectedKeys: ["00"]
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
     * 保存事件
     */
    save = () => {
        let langMultiData = this.state.langMultiData;
        this.props.form.validateFields(errors => {
            if (!errors) {
                let { isNew, fields } = this.state;
                let saveURL, data;
                let newFieldsData = this.props.form.getFieldsValue();
                let newFields = { ...fields, ...newFieldsData };
                if (isNew) {
                    saveURL = `/nccloud/platform/appregister/insertindividualreg.do`;
                    data = newFields;
                } else {
                    saveURL = `/nccloud/platform/appregister/editindividualreg.do`;
                    data = newFields;
                }
                Ajax({
                    url: saveURL,
                    info: {
                        name: langCheck(
                            "1022PREGI-000001",
                            true,
                            langMultiData
                        ) /* 国际化处理： 个性化注册*/,
                        action: langCheck(
                            "1022PREGI-000003",
                            true,
                            langMultiData
                        ) /* 国际化处理： 保存*/
                    },
                    data: data,
                    success: ({ data: { data } }) => {
                        if (data) {
                            let treeData = [...this.state.treeData];
                            if (isNew) {
                                treeData = _.concat(treeData, data);
                                newFields = data;
                            } else {
                                let dataIndex = _.findIndex(
                                    treeData,
                                    item =>
                                        item.pk_individualreg ===
                                        fields.pk_individualreg
                                );
                                treeData[dataIndex] = newFields;
                            }
                            this.setState(
                                {
                                    isNew: false,
                                    isedit: false,
                                    selectedKeys: [fields.code],
                                    parentKey: fields.code,
                                    treeData,
                                    fields: newFields,
                                    formData: { ...newFieldsData }
                                },
                                () => {
                                    this.handleSelect(newFields.code);
                                }
                            );
                            Notice({
                                status: "success",
                                msg: data.true
                                    ? data.true
                                    : langCheck(
                                          "1022PREGI-000004",
                                          true,
                                          langMultiData
                                      ) /* 国际化处理： 保存成功！*/
                            });
                        }
                    }
                });
            }
        });
    };
    /**
     * 树节点选中事件
     * @param {String} selectedKey
     */
    handleSelect = selectedKey => {
        if (this.treeNodeChange()) {
            return;
        }
        let { treeData, selectedKeys } = this.state;
        if (selectedKey === "00" || selectedKey === undefined) {
            selectedKeys = ["00"];
            this.setState({
                isedit: false,
                selectedKeys,
                parentKey: selectedKey ? selectedKey : "",
                fields: { ...this.newFormData },
                formData: { ...this.newFormData }
            });
            return;
        }
        selectedKeys = [selectedKey];
        let treeItem = treeData.find(item => item.code === selectedKey);
        this.historyData = { ...treeItem };
        this.setState({
            isedit: false,
            isNew: false,
            selectedKeys,
            parentKey: selectedKey,
            fields: { ...treeItem },
            formData: {
                code: treeItem.code,
                name: treeItem.name,
                resourceid: treeItem.resourceid,
                resourcepath: treeItem.resourcepath,
                page_part_url: treeItem.page_part_url
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
                this.save();
                flag = false;
            });
        } else {
            flag = false;
        }
        return flag;
    };
    /**
     * 表单任一字段值改变操作
     * @param {String|Object} changedFields 改变的字段及值
     */
    handleFormChange = changedFields => {
        this.setState(({ fields }) => ({
            fields: { ...fields, ...changedFields }
        }));
    };
    componentDidMount() {
        let langMultiData = this.state.langMultiData;
        getMulti({
            moduleId: "1022PREGI",
            // currentLocale: 'zh-CN',
            domainName: "workbench",
            callback: json => {
                this.setState({
                    langMultiData: json
                });
            }
        });
        Ajax({
            url: `/nccloud/platform/appregister/queryindividualreg.do`,
            info: {
                name: langCheck(
                    "1022PREGI-000001",
                    true,
                    langMultiData
                ) /* 国际化处理： 个性化注册*/,
                action: langCheck(
                    "1022PREGI-000005",
                    true,
                    langMultiData
                ) /* 国际化处理： 查询*/
            },
            success: res => {
                let { success, data } = res.data;
                if (success && data) {
                    this.setState({ treeData: data }, () => {
                        if (data.length > 0) {
                            this.handleSelect(data[0].code);
                        }
                    });
                }
            }
        });
    }
    render() {
        let langMultiData = this.state.langMultiData;
        let {
            treeData,
            formData,
            fields,
            isedit,
            isNew,
            selectedKeys
        } = this.state;
        let { code, name, resourceid, resourcepath, page_part_url } = formData;
        let individuationFormData = [
            {
                code: "code",
                type: "string",
                label: langCheck(
                    "1022PREGI-000006",
                    true,
                    langMultiData
                ) /* 国际化处理： 编码*/,
                isRequired: true,
                isedit: isedit,
                initialValue: code,
                xs: 24,
                md: 12,
                lg: 12
            },
            {
                code: "name",
                type: "string",
                label: langCheck(
                    "1022PREGI-000007",
                    true,
                    langMultiData
                ) /* 国际化处理： 名称*/,
                isRequired: true,
                isedit: isedit,
                initialValue: name,
                xs: 24,
                md: 12,
                lg: 12
            },
            {
                code: "resourceid",
                type: "string",
                label: langCheck(
                    "1022PREGI-000008",
                    true,
                    langMultiData
                ) /* 国际化处理： 名称->资源ID*/,
                isRequired: true,
                isedit: isedit,
                initialValue: resourceid,
                xs: 24,
                md: 12,
                lg: 12
            },
            {
                code: "resourcepath",
                type: "string",
                label: langCheck(
                    "1022PREGI-000009",
                    true,
                    langMultiData
                ) /* 国际化处理： 名称->资源路径*/,
                isRequired: true,
                isedit: isedit,
                initialValue: resourcepath,
                xs: 24,
                md: 12,
                lg: 12
            },
            {
                code: "page_part_url",
                type: "string",
                label: langCheck(
                    "1022PREGI-000010",
                    true,
                    langMultiData
                ) /* 国际化处理： 页面片段URL*/,
                isRequired: true,
                initialValue: page_part_url,
                isedit: isedit
            }
        ];
        let btnList = [
            {
                name: langCheck(
                    "1022PREGI-000011",
                    true,
                    langMultiData
                ) /* 国际化处理： 新增*/,
                code: "add",
                type: "primary",
                isshow:
                    (this.state.parentKey === "" ||
                        this.state.parentKey === "00") &&
                    !isedit
            },
            {
                name: langCheck(
                    "1022PREGI-000012",
                    true,
                    langMultiData
                ) /* 国际化处理： 修改*/,
                code: "edit",
                type: "primary",
                group: true,
                isshow:
                    this.state.parentKey !== "" &&
                    this.state.parentKey !== "00" &&
                    !isedit
            },
            {
                name: langCheck(
                    "1022PREGI-000002",
                    true,
                    langMultiData
                ) /* 国际化处理： 删除*/,
                code: "del",
                type: "",
                group: true,
                isshow:
                    this.state.parentKey !== "" &&
                    this.state.parentKey !== "00" &&
                    !isedit
            },
            {
                name: langCheck(
                    "1022PREGI-000003",
                    true,
                    langMultiData
                ) /* 国际化处理： 保存*/,
                code: "save",
                type: "primary",
                isshow: isedit
            },
            {
                name: langCheck(
                    "1022PREGI-000013",
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
                className="nc-workbench-individuation"
                header={
                    <PageLayoutHeader>
                        <div>
                            {langCheck(
                                "1022PREGI-000001",
                                true,
                                langMultiData
                            ) /* 国际化处理： 个性化注册*/}
                        </div>
                        <ButtonCreate
                            dataSource={btnList}
                            onClick={this.handleBtnClick}
                        />
                    </PageLayoutHeader>
                }
            >
                <PageLayoutLeft>
                    <TreeCom
                        selectedKeys={selectedKeys}
                        onSelect={this.handleSelect}
                        dataSource={treeData}
                        rootTitle={langCheck(
                            "1022PREGI-000000",
                            true,
                            langMultiData
                        )} /* 国际化处理： 个性化设置*/
                    />
                </PageLayoutLeft>
                <PageLayoutRight className="workbench-auto-scroll">
                    <div className="nc-workbench-individuation-form">
                        {(this.state.parentKey === "" ||
                            this.state.parentKey === "00") &&
                        !isNew ? (
                            ""
                        ) : (
                            <FormContent
                                datasources={dataDefaults(
                                    this.state.formData,
                                    individuationFormData,
                                    "code"
                                )}
                                form={this.props.form}
                                formData={individuationFormData}
                            />
                        )}
                    </div>
                </PageLayoutRight>
            </PageLayout>
        );
    }
}
IndividuationRegister = Form.create()(IndividuationRegister);
export default IndividuationRegister;
