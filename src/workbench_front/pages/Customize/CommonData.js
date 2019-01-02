import React, { Component } from "react";
import { connect } from "react-redux";
import { Button } from "antd";
import ComLayout from "./ComLayout";
import * as platform from "nc-lightapp-front";
const { createPage, high } = platform;
const { Refer } = high;
import Notice from "Components/Notice";
import Ajax from "Pub/js/ajax";
import { Popconfirm } from "antd";
import { langCheck } from 'Pub/js/utils';
class CommonData extends Component {
    constructor(props) {
        super(props);
        this.state = {
            key: "10220PLOG_customer",
            record: null, // 页面表格中选中的单条数据信息
            refItemValue: {
                // "refcode": "bd_customer",
                // "refname": "客户",
                // "refpk": "0001Z5100000000AAAAA",
                refcode: "",
                refname: "",
                refpk: ""
            } //参照选中的单条数据值
        };
    }
    /**
     * 参照选中单条数据所触发的事件
     */
    handdleRefChange = refItemValue => {
        if (refItemValue["refcode"]) {
            let key = refItemValue["refcode"].replace("bd_", "10220PLOG_");
            this.setState(
                {
                    key,
                    refItemValue
                },
                () => {
                    this.searchBtnClick(refItemValue["refcode"]);
                }
            );
        } else {
            this.setState({
                refItemValue: {
                    refcode: "",
                    refname: "",
                    refpk: ""
                }
            });
        }
    };
    /**
     * 行点击事件
     */
    onRowClick = (props, moduleId, record, index, event) => {
        console.log(record);
        this.setState({
            record
        });
    };
    /**
     * 分页  暂不处理
     */
    handlePageInfoChange = (props, config, pks) => {
        // this.searchBtnClick("pageChange", pks);
    };
    /**
     * 查询
     */
    searchBtnClick = type => {
        this.getData();
        const { table } = this.props;
        const { setAllTableData } = table;
        let data = {
            tableName: type,
            pk_user: this.props.userId,
            pk_group: this.props.groupId
        };
        // if (type == "pageChange") {
        //     data.pageInfo.pagepks = pks;
        // }
        Ajax({
            data,
            info: {
                name: this.props.MutiInit.getIntl("Customize") && this.props.MutiInit.getIntl("Customize").get("Customize-000031"),
                action: this.props.MutiInit.getIntl("Customize") && this.props.MutiInit.getIntl("Customize").get("Customize-000027"),
                appcode: "10220PLOGG"
            },
            url: "/nccloud/platform/freuseddata/queryfreuseddata.do",
            success: ({data}) => {
                if (data.data !== null && data.data.grid) {
                    setAllTableData("grid", data.data.grid);
                } else {
                    setAllTableData("grid", {
                        rows: []
                    });
                }
            }
        });
    };
    deleteEvent = (record, index) => {
        console.log(record, index);
        const { table } = this.props;
        const { deleteTableRowsByIndex, getAllTableData } = table;
        const { key } = this.state;
        let curUrl = "";
        let data = {
            pk_user: this.props.userId,
            pk_group: this.props.groupId
            // pk_user:"1001A410000000007L5U",
            // pk_group:"0001A1100000000005T5",
        };
        let dataInfo = getAllTableData("grid")["rows"][index]["values"];
        switch (key) {
            case "10220PLOG_customer": //客户
                data = {
                    ...data,
                    tableName: "bd_customer",
                    pks: [dataInfo.pk_customer.value]
                };
                break;
            case "10220PLOG_material": //物料
                data = {
                    ...data,
                    tableName: "bd_material",
                    pks: [dataInfo.pk_material.value]
                };
                break;
            case "10220PLOG_psndoc": //人员
                data = {
                    ...data,
                    tableName: "bd_psndoc",
                    pks: [dataInfo.pk_psndoc.value]
                };
                break;
            case "10220PLOG_supplier": //供应商
                data = {
                    ...data,
                    tableName: "bd_supplier",
                    pks: [dataInfo.pk_supplier.value]
                };
                break;
        }
        Ajax({
            url: `/nccloud/platform/freuseddata/deletefreuseddata.do`,
            data,
            info: {
                name: this.props.MutiInit.getIntl("Customize") && this.props.MutiInit.getIntl("Customize").get("Customize-000031"),
                appcode: "10220PLOGG",
                action:
                    this.props.MutiInit.getIntl("Customize") &&
                    this.props.MutiInit.getIntl("Customize").get(
                        "Customize-000025"
                    ) /* 国际化处理： 清空*/
            },
            success: res => {
                deleteTableRowsByIndex("grid", index);
                Notice({
                    status: "success"
                });
            }
        });
    };
    componentDidMount() {
        // this.getData();
        // this.searchBtnClick("bd_customer");
        //把nc-lightapp-front暴露给全局，供全局使用（艺轩）
        window["nc-lightapp-front"] = platform;
    }
    getData = () => {
        const { key } = this.state;
        const { createUIDom } = this.props;
        createUIDom(
            {
                appcode: "10220PLOGG",
                pagecode: key
            },
            this.callbackFun
        );
    };
    /**
     * 渲染表格查询区
     */
    callbackFun = templedata => {
        if (templedata) {
            if (templedata.template) {
                let meta = templedata.template;
                meta = this.modifier(meta, this.props, this);
                this.props.meta.setMeta(meta);
            }
            if (templedata.button) {
                let button = templedata.button;
                this.props.button.setButtons(button);
            }
        }
    };
    /**
     * 操作列
     */
    modifier = (meta, props, that) => {
        const { key } = this.state;
        //添加表格操作列
        let lastest = {
            label:
                props.MutiInit.getIntl("Customize") &&
                props.MutiInit.getIntl("Customize").get(
                    "Customize-000018"
                ) /* 国际化处理： 操作*/,
            attrcode: "opr",
            itemtype: "customer",
            width: "80px",
            fixed: "right",
            visible: true,
            render(text, record, index) {
                return (
                    <div>
                        <Popconfirm
                            title={
                                props.MutiInit.getIntl("Customize") &&
                                props.MutiInit.getIntl("Customize").get(
                                    "Customize-000026"
                                )
                            } /* 国际化处理： 确认删除该信息吗?*/
                            cancelText={
                                props.MutiInit.getIntl("Customize") &&
                                props.MutiInit.getIntl("Customize").get(
                                    "Customize-000008"
                                )
                            } /* 国际化处理： 取消*/
                            okText={
                                props.MutiInit.getIntl("Customize") &&
                                props.MutiInit.getIntl("Customize").get(
                                    "Customize-000009"
                                )
                            } /* 国际化处理： 确定*/
                            onConfirm={that.deleteEvent.bind(
                                this,
                                record,
                                index
                            )}
                        >
                            <a className="opr-col">
                                {props.MutiInit.getIntl("Customize") &&
                                    props.MutiInit.getIntl("Customize").get(
                                        "Customize-000013"
                                    ) /* 国际化处理： 删除*/}
                            </a>
                        </Popconfirm>
                    </div>
                );
            }
        };
        let firstest = {
            label:
                props.MutiInit.getIntl("Customize") &&
                props.MutiInit.getIntl("Customize").get(
                    "Customize-000015"
                ) /* 国际化处理： 序号*/,
            attrcode: "num",
            itemtype: "customer",
            width: "60px",
            fixed: "left",
            visible: true,
            render(text, record, index) {
                return <div>{index + 1}</div>;
            }
        };
        meta.grid.items.push(lastest);
        meta.grid.items.unshift(firstest);
        // meta.grid.pagination = true;
        return meta;
    };
    render() {
        if(!this.props.MutiInit.getIntl("Customize")){
            return null;
        }
        let { search, table } = this.props;
        const { createSimpleTable } = table;
        return (
            <ComLayout title={this.props.title}>
                <div className="commonData">
                    <Refer
                        refType="grid"
                        refName={langCheck('0000PUB-000085')}/* 国际化处理： 常用数据*/
                        placeholder={langCheck('0000PUB-000084')} /* 国际化处理： 常用数据档案*/
                        value={this.state.refItemValue}
                        onChange={value => {
                            this.handdleRefChange(value);
                        }}
                        refCode=""
                        queryGridUrl="/nccloud/platform/appregister/freuseddataref.do"
                        isMultiSelectedEnabled={false}
                        columnConfig={[
                            {
                                name: [langCheck('0000PUB-000032'), langCheck('0000PUB-000033')],
                                code: ["refcode", "refname"]
                            }
                        ]} /* 国际化处理： 编码,名称*/
                        popWindowClassName="commonDataRef"
                    />
                    {this.props.MutiInit.getIntl("Customize") &&
                        this.props.MutiInit.getIntl("Customize").get(
                            "Customize-000028"
                        ) /* 国际化处理： 查看基础档案的常用数据*/}
                </div>
                {this.state.refItemValue.refcode ? (
                    createSimpleTable("grid", {
                        onRowClick: this.onRowClick,
                        handlePageInfoChange: this.handlePageInfoChange
                    })
                ) : (
                    <div className="CoverPosition-content-treeCardTable">
                        <p>
                            {this.props.MutiInit.getIntl("Customize") &&
                                this.props.MutiInit.getIntl("Customize").get(
                                    "Customize-000030"
                                ) /* 国际化处理： 请先选择常用档案数据*/}
                        </p>
                    </div>
                )}
            </ComLayout>
        );
    }
}
const CommonDataInfo = createPage({
    mutiLangCode: "Customize"
})(CommonData);

export default connect(state => {
    return {
        userId: state.appData.userId,
        groupId: state.appData.groupId
    };
})(CommonDataInfo);
