import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Tabs, Button, Table, Popconfirm } from "antd";
import _ from "lodash";
import { setAppParamData } from "Store/AppRegister/action";
import Ajax from "Pub/js/ajax";
import Notice from "Components/Notice";
import CoverPosotion from "Components/CoverPosition";
import EditableCell from "Components/EditableCell";
import { langCheck } from "Pub/js/utils";
const TabPane = Tabs.TabPane;
/**
 * 表格表头必输项渲染
 * @param {String} title
 */
const RenderTableTitle = title => (
    <span>
        <span style={{ color: "#e14c46" }}>*</span>
        <span>{title}</span>
    </span>
);
/**
 * 应用页面 参数表格组件
 *
 */
class AppTable extends Component {
    constructor(props) {
        super(props);
        this.cacheData;
        /* 检验数组 */
        this.paramList = [
            {
                key: "paramname",
                name: langCheck(
                    "102202APP-000060",
                    "pages",
                    props.langJson
                ) /* 国际化处理： 参数名称 */,
                required: true
            },
            {
                key: "paramvalue",
                name: langCheck(
                    "102202APP-000061",
                    "pages",
                    props.langJson
                ) /* 国际化处理： 参数值*/,
                required: true
            }
        ];
    }
    /**
     * 表格编辑单元格
     * @param {String} key
     * @param {Number} index
     * @param {String} value
     */
    handleCellChange = (key, index, value) => {
        const listData = this.getNewData();
        listData[index][key] = value;
        this.props.setAppParamData(listData);
    };
    /**
     * 单元格编辑校验
     */
    handleCellCheck = (key, index, value) => {
        let newData = this.getNewData();
        if (!value && value.length === 0) {
            newData[index]["hasError"] = true;
            this.props.setAppParamData(newData);
            return {
                hasError: true
            };
        } else {
            newData[index]["hasError"] = false;
            this.props.setAppParamData(newData);
            return {
                hasError: false
            };
        }
    };
    edit(record) {
        let newData = this.getNewData();
        const dataList = newData.filter(item => item.editable === true);
        if (dataList.length > 0) {
            Notice({
                status: "warning",
                msg: langCheck("102202APP-000051", "pages", this.props.langJson)
            }); /* 国际化处理： 请逐条修改按钮！*/
            return;
        }
        this.cacheData = _.cloneDeep(newData);
        const target = newData.filter(item => record.num === item.num)[0];
        if (target) {
            target.editable = true;
            this.props.setAppParamData(newData);
        }
    }
    del(record) {
        if (record.pk_param) {
            let newData = this.getNewData();
            Ajax({
                url: `/nccloud/platform/appregister/deleteparam.do`,
                data: {
                    pk_param: record.pk_param
                },
                info: {
                    name: langCheck(
                        "102202APP-000052",
                        "pages",
                        this.props.langJson
                    ) /* 国际化处理： 应用参数*/,
                    action: langCheck(
                        "102202APP-000053",
                        "pages",
                        this.props.langJson
                    ) /* 国际化处理： 删除*/
                },
                success: ({ data: { data } }) => {
                    if (data) {
                        _.remove(
                            newData,
                            item => record.pk_param === item.pk_param
                        );
                        this.props.setAppParamData(newData);
                        this.cacheData = _.cloneDeep(newData);
                        Notice({ status: "success", msg: data.msg });
                    }
                }
            });
        }
    }
    save(record) {
        let newData = this.getNewData();
        // 判断必输项
        let enptyCell = this.paramList.filter(
            item =>
                (item.required && !record[item.key]) ||
                (item.required &&
                    record[item.key] &&
                    record[item.key].length === 0)
        );
        if (enptyCell.length > 0) {
            let enptyCellName = enptyCell.map(item => item.name);
            Notice({
                status: "error",
                msg: `${langCheck(
                    "102202APP-000054",
                    "pages",
                    this.props.langJson
                )}${enptyCellName.toString()}`
            }); /* 国际化处理： 下列字段段不能为空：*/
            return;
        }
        let url, listData, info;
        const target = newData.filter(item => record.num === item.num)[0];
        if (target) {
            if (target.pk_param) {
                url = `/nccloud/platform/appregister/editparam.do`;
                info = {
                    name: langCheck(
                        "102202APP-000052",
                        "pages",
                        this.props.langJson
                    ) /* 国际化处理： 应用参数*/,
                    action: langCheck(
                        "102202APP-000055",
                        "pages",
                        this.props.langJson
                    ) /* 国际化处理： 编辑*/
                };
            } else {
                url = `/nccloud/platform/appregister/insertparam.do`;
                info = {
                    name: langCheck(
                        "102202APP-000052",
                        "pages",
                        this.props.langJson
                    ) /* 国际化处理： 应用参数*/,
                    action: langCheck(
                        "102202APP-000056",
                        "pages",
                        this.props.langJson
                    ) /* 国际化处理： 新增*/
                };
            }
            listData = {
                ...target
            };
            Ajax({
                url: url,
                info: info,
                data: listData,
                success: ({ data: { data } }) => {
                    if (data) {
                        delete target.editable;
                        if (listData.pk_param) {
                            newData.map((item, index) => {
                                if (listData.pk_param === item.pk_param) {
                                    return { ...item, ...listData };
                                } else {
                                    return item;
                                }
                            });
                            this.props.setAppParamData(newData);
                        } else {
                            newData[newData.length - 1] = data;
                            this.props.setAppParamData(newData);
                        }
                        this.cacheData = _.cloneDeep(newData);
                        Notice({ status: "success", msg: data.msg });
                    }
                }
            });
        }
    }
    cancel(record) {
        let newData = this.getNewData();
        const target = newData.filter(item => record.num === item.num)[0];
        if (target) {
            delete target.editable;
            this.props.setAppParamData(this.cacheData);
        }
    }
    add() {
        if (this.props.isNew) {
            Notice({
                status: "warning",
                msg: langCheck("102202APP-000057", "pages", this.props.langJson)
            }); /* 国际化处理： 请先将应用进行保存！*/
            return;
        }
        let newData = this.getNewData();
        const target = newData.filter(item => item.editable === true);
        if (target.length > 0) {
            Notice({
                status: "warning",
                msg: langCheck("102202APP-000058", "pages", this.props.langJson)
            }); /* 国际化处理： 请逐条添加按钮！*/
            return;
        }
        this.cacheData = _.cloneDeep(newData);
        newData.push({
            editable: true,
            paramname: "",
            paramvalue: "",
            parentid: this.props.nodeInfo.id
        });
        this.props.setAppParamData(newData);
    }
    getNewData() {
        let appParamVOs = this.props.appParamVOs;
        return _.cloneDeep(appParamVOs);
    }
    /**
     * 创建按钮
     */
    creatAddLineBtn = () => {
        return (
            <div>
                <Button
                    onClick={() => this.add()}
                    style={{ marginLeft: "8px" }}
                >
                    {langCheck(
                        "102202APP-000068",
                        "pages",
                        this.props.langJson
                    )}
                    {/* 国际化处理： 增行*/}
                </Button>
            </div>
        );
    };
    render() {
        let appParamVOs = this.props.appParamVOs;
        let flag = appParamVOs.find(item => item.editable);
        let langJson = this.props.langJson;
        let columnsPar = [
            {
                title: langCheck(
                    "102202APP-000059",
                    "pages",
                    langJson
                ) /* 国际化处理： 序号*/,
                dataIndex: "num",
                width: "5%"
            },
            {
                title: flag
                    ? RenderTableTitle(
                          langCheck("102202APP-000060", "pages", langJson)
                      )
                    : langCheck(
                          "102202APP-000060",
                          "pages",
                          langJson
                      ) /* 国际化处理： 参数名称,参数名称*/,
                dataIndex: "paramname",
                width: "25%",
                render: (text, record, index) => (
                    <EditableCell
                        type={"string"}
                        value={text}
                        editable={record.editable}
                        cellIndex={index}
                        cellKey={"paramname"}
                        cellRequired={true}
                        cellChange={this.handleCellChange}
                        cellCheck={this.handleCellCheck}
                    />
                )
            },
            {
                title: flag
                    ? RenderTableTitle(
                          langCheck("102202APP-000061", "pages", langJson)
                      )
                    : langCheck(
                          "102202APP-000061",
                          "pages",
                          langJson
                      ) /* 国际化处理： 参数值,参数值*/,
                width: "55%",
                dataIndex: "paramvalue",
                render: (text, record, index) => (
                    <EditableCell
                        type={"string"}
                        value={text}
                        editable={record.editable}
                        cellIndex={index}
                        cellKey={"paramvalue"}
                        cellRequired={true}
                        cellChange={this.handleCellChange}
                        cellCheck={this.handleCellCheck}
                    />
                )
            },
            {
                title: langCheck(
                    "102202APP-000062",
                    "pages",
                    langJson
                ) /* 国际化处理： 操作*/,
                dataIndex: "operation",
                render: (text, record) => {
                    const { editable } = record;
                    return (
                        <div className="editable-row-operations">
                            {editable ? (
                                <span>
                                    <a
                                        className="margin-right-15"
                                        onClick={() => this.save(record)}
                                    >
                                        {langCheck(
                                            "102202APP-000069",
                                            "pages",
                                            langJson
                                        )}
                                        {/* 国际化处理： 保存*/}
                                    </a>
                                    <Popconfirm
                                        title={langCheck(
                                            "102202APP-000063",
                                            "pages",
                                            langJson
                                        )} /* 国际化处理： 确定取消?*/
                                        cancelText={langCheck(
                                            "102202APP-000064",
                                            "pages",
                                            langJson
                                        )} /* 国际化处理： 取消*/
                                        okText={langCheck(
                                            "102202APP-000065",
                                            "pages",
                                            langJson
                                        )} /* 国际化处理： 确定*/
                                        onConfirm={() => this.cancel(record)}
                                    >
                                        <a className="margin-right-5">
                                            {langCheck(
                                                "102202APP-000064",
                                                "pages",
                                                langJson
                                            )}
                                        </a>
                                        {/* 国际化处理： 取消*/}
                                    </Popconfirm>
                                </span>
                            ) : (
                                <span>
                                    <a
                                        className="margin-right-15"
                                        onClick={() => this.edit(record)}
                                    >
                                        {langCheck(
                                            "102202APP-000055",
                                            "pages",
                                            langJson
                                        )}
                                        {/* 国际化处理： 编辑*/}
                                    </a>
                                    <Popconfirm
                                        title={langCheck(
                                            "102202APP-000066",
                                            "pages",
                                            langJson
                                        )} /* 国际化处理： 确定删除?*/
                                        cancelText={langCheck(
                                            "102202APP-000064",
                                            "pages",
                                            langJson
                                        )} /* 国际化处理： 取消*/
                                        okText={langCheck(
                                            "102202APP-000065",
                                            "pages",
                                            langJson
                                        )} /* 国际化处理： 确定*/
                                        onConfirm={() => this.del(record)}
                                    >
                                        <a className="margin-right-15">
                                            {langCheck(
                                                "102202APP-000053",
                                                "pages",
                                                langJson
                                            )}
                                        </a>
                                        {/* 国际化处理： 删除*/}
                                    </Popconfirm>
                                </span>
                            )}
                        </div>
                    );
                }
            }
        ];
        return (
            <Tabs activeKey="1" tabBarExtraContent={this.creatAddLineBtn()}>
                <TabPane
                    tab={langCheck("102202APP-000067", "pages", langJson)}
                    key="1"
                >
                    {/* 国际化处理： 参数注册*/}
                    <Table
                        bordered
                        locale={{
                            emptyText: <CoverPosotion type="treeCardTable" />
                        }}
                        pagination={false}
                        rowKey="num"
                        dataSource={appParamVOs.map((item, index) => {
                            item.num = index + 1;
                            return item;
                        })}
                        columns={columnsPar}
                        size="middle"
                    />
                </TabPane>
            </Tabs>
        );
    }
}
AppTable.propTypes = {
    isNew: PropTypes.bool.isRequired,
    nodeData: PropTypes.object.isRequired,
    nodeInfo: PropTypes.object.isRequired,
    appParamVOs: PropTypes.array.isRequired,
    setAppParamData: PropTypes.func.isRequired
};
export default connect(
    state => ({
        isNew: state.AppRegisterData.isNew,
        nodeInfo: state.AppRegisterData.nodeInfo,
        nodeData: state.AppRegisterData.nodeData,
        appParamVOs: state.AppRegisterData.appParamVOs,
        langJson: state.AppRegisterData.langJson
    }),
    { setAppParamData }
)(AppTable);
