import React, { Component } from "react";
import { Button } from "antd";
import ComLayout from "./ComLayout";
// 业务单元
import BusinessUnitTreeRef from "Components/Refers/BusinessUnitTreeRef";
// 财务核算账簿
import AccountBookTreeRef from "Components/Refers/AccountBookTreeRef";
// 默认信用控制域
import CreditCtlRegionGridRef from "Components/Refers/CreditCtlRegionGridRef";
// 默认成本域
import CostRegionDefaultGridRef from "Components/Refers/CostRegionDefaultGridRef";
// 默认内容语种参照
import ContentLangRef from "Components/Refers/ContentLangRef";
// 默认数据格式参照
import DataFormatRef from "Components/Refers/DataFormatRef";
import Notice from "Components/Notice";
import Ajax from "Pub/js/ajax";
import { langCheck } from "Pub/js/utils.js";
class DefaultSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            // 默认业务单元
            org_df_biz: {
                refcode: "",
                refname: "",
                refpk: ""
            },
            // 信用控制域
            org_df_credit: {
                refcode: "",
                refname: "",
                refpk: ""
            },
            // 默认成本域
            org_df_cost: {
                refcode: "",
                refname: "",
                refpk: ""
            },
            // 默认财务核算账簿
            org_df_fa: {
                refcode: "",
                refname: "",
                refpk: ""
            },
            // 默认数据格式参照
            dataFormat: {
                refcode: "",
                refname: "",
                refpk: ""
            },
            // 默认内容语种参照
            contentLang: {
                refcode: "",
                refname: "",
                refpk: ""
            },
            // 应用按钮是否可用
            disabled: true
        };
        this.historyData;
    }
    getAllData = () => {
        let { json } = this.props;
        let individualPropertyVOs = [
            {
                propertyname: "org_df_biz",
                value: ""
            },
            {
                propertyname: "org_df_fa",
                value: ""
            },
            {
                propertyname: "org_df_credit",
                value: ""
            },
            {
                propertyname: "org_df_cost",
                value: ""
            }
        ];
        individualPropertyVOs = individualPropertyVOs.map(item => {
            item.value = this.state[item.propertyname]["refpk"];
            return item;
        });
        let reqData = {
            individualPropertyVOs,
            dataFormat: this.state["dataFormat"]["refpk"],
            contentLang: this.state["contentLang"]["refpk"]
        };
        Ajax({
            url: `/nccloud/platform/appregister/saveindividualpro.do`,
            data: reqData,
            info: {
                name: langCheck('Customize-000032', 'pages', json),/* 国际化处理： 个性化-默认设置*/
                action: langCheck('Customize-000003', 'pages', json)/* 国际化处理： 保存*/
            },
            success: ({ data: { data } }) => {
                if (data) {
                    Notice({
                        status: "success"
                    });
                    data = this.defaultRefValueInit(data);
                    this.historyData = data;
                    this.setState({ ...data, disabled: true });
                }
            }
        });
    };
    handdleRefChange = (value, type) => {
        console.log(value, type);
        let { refname = "", refcode = "", refpk = "" } = value;
        let obj = {};
        obj[type] = {};
        obj[type]["refname"] = refname;
        obj[type]["refcode"] = refcode;
        obj[type]["refpk"] = refpk;
        this.setState({ ...obj }, () => {
            let flag = this.DataCheck();
            this.setState({
                disabled: flag
            });
        });
    };
    // 数据检查
    DataCheck = () => {
        let Object = this.historyData;
        for (let key in Object) {
            if (Object[key]["refpk"] !== this.state[key]["refpk"]) {
                return false;
            }
        }
        return true;
    };
    /**
     * 初始化默认参照的数据
     */
    defaultRefValueInit = Object => {
        for (const key in Object) {
            if (!Object[key]) {
                Object[key] = {
                    refcode: "",
                    refname: "",
                    refpk: null
                };
            }
        }
        return Object;
    };
    componentDidMount() {
        let { json } = this.props;
        Ajax({
            url: `/nccloud/platform/appregister/queryindividualpro.do`,
            info: {
                name: langCheck('Customize-000032', 'pages', json),/* 国际化处理： 个性化-默认设置*/
                action: langCheck('Customize-000005', 'pages', json)/* 国际化处理： 查询*/
            },
            success: ({ data: { data } }) => {
                if (data) {
                    data = this.defaultRefValueInit(data);
                    this.historyData = data;
                    this.setState({ ...data });
                } else {
                    let {
                        org_df_biz,
                        org_df_credit,
                        org_df_cost,
                        org_df_fa,
                        dataFormat,
                        contentLang
                    } = this.state;
                    this.historyData = {
                        org_df_biz,
                        org_df_credit,
                        org_df_cost,
                        org_df_fa,
                        dataFormat,
                        contentLang
                    };
                }
            }
        });
    }
    render() {
        let {
            org_df_biz,
            org_df_credit,
            org_df_cost,
            org_df_fa,
            contentLang,
            dataFormat,
            disabled,
        } = this.state;
        let { json } =this.props;
        return (
            <ComLayout title={this.props.title}>
                <div className="defaultSetting workbench-auto-scroll">
                    <div className="default-title">{langCheck('Customize-000039', 'pages', json)/* 国际化处理： 默认设置*/}</div>
                    <div className="default-form-container">
                        <div className="default-form">
                            <label className="default-label">
                                {langCheck('Customize-000033', 'pages', json)/* 国际化处理： 默认业务单元*/}
                            </label>
                            <BusinessUnitTreeRef
                                value={org_df_biz}
                                // placeholder={langCheck('Customize-000033', 'pages', json)}/* 国际化处理： 默认业务单元*/
                                placeholder=""
                                onChange={value => {
                                    this.handdleRefChange(value, "org_df_biz");
                                }}
                            />
                        </div>
                        <div className="default-form">
                            <label className="default-label">
                                {langCheck('Customize-000034', 'pages', json)/* 国际化处理： 默认财务核算账簿*/}
                            </label>
                            <AccountBookTreeRef
                                isMultiSelectedEnabled={false}
                                value={org_df_fa}
                                // placeholder={langCheck('Customize-000034', 'pages', json)}/* 国际化处理： 默认财务核算账簿*/
                                placeholder=""
                                queryCondition={() => {
                                    return {
                                        TreeRefActionExt:
                                            "nccloud.web.platform.workbench.ref.filter.AccountBookRefPermissionFilter"
                                    };
                                }}
                                onChange={value => {
                                    this.handdleRefChange(value, "org_df_fa");
                                }}
                            />
                        </div>
                        <div className="default-form">
                            <label className="default-label">
                                {langCheck('Customize-000035', 'pages', json)/* 国际化处理： 默认信用控制域*/}
                            </label>
                            <CreditCtlRegionGridRef
                                value={org_df_credit}
                                // placeholder={langCheck('Customize-000035', 'pages', json)}/* 国际化处理： 默认信用控制域*/
                                placeholder=""
                                onChange={value => {
                                    this.handdleRefChange(
                                        value,
                                        "org_df_credit"
                                    );
                                }}
                            />
                        </div>
                        <div className="default-form">
                            <label className="default-label">{langCheck('Customize-000036', 'pages', json)/* 国际化处理： 默认成本域*/}</label>
                            <CostRegionDefaultGridRef
                                value={org_df_cost}
                                // placeholder={langCheck('Customize-000036', 'pages', json)}/* 国际化处理： 默认成本域*/
                                placeholder=""
                                onChange={value => {
                                    this.handdleRefChange(value, "org_df_cost");
                                }}
                            />
                        </div>
                    </div>
                    <div className="default-title margin-top-20">
                        {langCheck('Customize-000040', 'pages', json)/* 国际化处理： 默认语言格式*/}
                    </div>
                    <div className="default-form-container">
                        <div className="default-form">
                            <label className="default-label item-required">
                                {langCheck('Customize-000037', 'pages', json)/* 国际化处理： 默认数据格式*/}
                            </label>
                            <DataFormatRef
                                value={dataFormat}
                                // placeholder={langCheck('Customize-000037', 'pages', json)}/* 国际化处理： 默认数据格式*/
                                placeholder=""
                                onChange={value => {
                                    if (value.refcode) {
                                        this.handdleRefChange(
                                            value,
                                            "dataFormat"
                                        );
                                    } else {
                                        return;
                                    }
                                }}
                            />
                        </div>
                        <div className="default-form">
                            <label className="default-label item-required">
                                {langCheck('Customize-000038', 'pages', json)/* 国际化处理： 默认内容语种*/}
                            </label>
                            <ContentLangRef
                                value={contentLang}
                                // placeholder={langCheck('Customize-000038', 'pages', json)}/* 国际化处理： 默认内容语种*/
                                placeholder=""
                                onChange={value => {
                                    if (value.refcode) {
                                        this.handdleRefChange(
                                            value,
                                            "contentLang"
                                        );
                                    } else {
                                        return;
                                    }
                                }}
                            />
                        </div>
                    </div>
                    <div className="default-footer">
                        <Button
                            type="primary"
                            disabled={disabled}
                            onClick={this.getAllData}
                        >
                            {langCheck('Customize-000020', 'pages', json)/* 国际化处理： 应用*/}
                        </Button>
                    </div>
                </div>
            </ComLayout>
        );
    }
}
export default DefaultSetting;
