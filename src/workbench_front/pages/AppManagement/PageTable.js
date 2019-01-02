import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { Tabs, Table, Select } from "antd";
import _ from "lodash";
import {
    setPageButtonData,
    setPageTemplateData,
    setPageActiveKey
} from "Store/AppManagement/action";
import EditableCell from "Components/EditableCell";
import CoverPosotion from "Components/CoverPosition";
import Ajax from "Pub/js/ajax";
import { langCheck } from 'Pub/js/utils';
const Option = Select.Option;
const TabPane = Tabs.TabPane;
const EditableSelectCell = ({ editable, value, onChange, langJson }) => (
    <div>
        {editable ? (
            <Select
                value={value}
                style={{ width: 120 }}
                onChange={selected => onChange(selected)}
            >
                <Option value="button_main">{langCheck('101818AM-000090',"pages", langJson)}</Option>{/* 国际化处理： 主要按钮*/}
                <Option value="button_secondary">{langCheck('101818AM-000091',"pages", langJson)}</Option>{/* 国际化处理： 次要按钮*/}
                <Option value="buttongroup">{langCheck('101818AM-000092',"pages", langJson)}</Option>{/* 国际化处理： 按钮组*/}
                <Option value="dropdown">{langCheck('101818AM-000093',"pages", langJson)}</Option>{/* 国际化处理： 下拉按钮*/}
                <Option value="divider">{langCheck('101818AM-000094',"pages", langJson)}</Option>{/* 国际化处理： 分割下拉按钮*/}
                <Option value="more">{langCheck('101818AM-000095',"pages", langJson)}</Option>{/* 国际化处理： 更多按钮*/}
            </Select>
        ) : (
            switchType(value, langJson)
        )}
    </div>
);
/**
 * 按钮类型选择
 * @param {String} value
 */
const switchType = (value, langJson) => {
    switch (value) {
        case "button_main":
            return langCheck('101818AM-000090',"pages", langJson);/* 国际化处理： 主要按钮*/
        case "button_secondary":
            return langCheck('101818AM-000091',"pages", langJson);/* 国际化处理： 次要按钮*/
        case "buttongroup":
            return langCheck('101818AM-000092',"pages", langJson);/* 国际化处理： 按钮组*/
        case "dropdown":
            return langCheck('101818AM-000093',"pages", langJson);/* 国际化处理： 下拉按钮*/
        case "divider":
            return langCheck('101818AM-000094',"pages", langJson);/* 国际化处理： 分割下拉按钮*/
        case "more":
            return langCheck('101818AM-000095',"pages", langJson);/* 国际化处理： 更多按钮*/
        default:
            break;
    }
};
class PageTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            iserror: false
        };
        this.columnsBtn = [
            {
                title: langCheck('101818AM-000057',"pages", props.langJson),/* 国际化处理： 序号*/
                dataIndex: "btnorder",
                width: "5%",
                render: text => text + 1
            },
            {
                title: langCheck('101818AM-000096',"pages", props.langJson),/* 国际化处理： 按钮编码*/
                dataIndex: "btncode",
                width: "10%",
                render: (text, record) =>
                    this.renderColumns(text, record, "btncode")
            },
            {
                title: langCheck('101818AM-000097',"pages", props.langJson),/* 国际化处理： 按钮名称*/
                dataIndex: "btnname",
                width: "10%",
                render: (text, record) =>
                    this.renderColumns(text, record, "btnname")
            },
            {
                title: langCheck('101818AM-000098',"pages", props.langJson),/* 国际化处理： 按钮类型*/
                dataIndex: "btntype",
                width: "15%",
                render: (text, record) =>
                    this.renderColumns(text, record, "btntype", "select")
            },
            {
                title: langCheck('101818AM-000099',"pages", props.langJson),/* 国际化处理： 父按钮编码*/
                dataIndex: "parent_code",
                width: "10%",
                render: (text, record) =>
                    this.renderColumns(text, record, "parent_code")
            },
            {
                title: langCheck('101818AM-000100',"pages", props.langJson),/* 国际化处理： 按钮区域*/
                dataIndex: "btnarea",
                width: "10%",
                render: (text, record) =>
                    this.renderColumns(text, record, "btnarea")
            },
            {
                title: langCheck('101818AM-000101',"pages", props.langJson),/* 国际化处理： 按钮功能描述*/
                dataIndex: "btndesc",
                width: "25%",
                render: (text, record) =>
                    this.renderColumns(text, record, "btndesc")
            },
            {
                title: langCheck('101818AM-000102',"pages", props.langJson),/* 国际化处理： 操作*/
                dataIndex: "operation",
                render: (text, record) => {
                    const { isenable } = record;
                    return (
                        <div className="editable-row-operations">
                            <a
                                className="margin-right-5"
                                onClick={() => this.btnActive(record)}
                            >
                                {isenable ? langCheck('101818AM-000072',"pages", props.langJson) : langCheck('101818AM-000047',"pages", props.langJson)}{/* 国际化处理： 停用,启用*/}
                            </a>
                        </div>
                    );
                }
            }
        ];
        this.columnsSt = [
            {
                title: langCheck('101818AM-000057',"pages", props.langJson),/* 国际化处理： 序号*/
                dataIndex: "num",
                width: "5%"
            },
            {
                title: langCheck('101818AM-000103',"pages", props.langJson),/* 国际化处理： 模板编码*/
                dataIndex: "code",
                width: "25%",
                render: (text, record) =>
                    this.renderColumns(text, record, "code")
            },
            {
                title: langCheck('101818AM-000104',"pages", props.langJson),/* 国际化处理： 模板名称*/
                dataIndex: "name",
                width: "15%",
                render: (text, record) =>
                    this.renderColumns(text, record, "name")
            },
            {
                title: langCheck('101818AM-000053',"pages", props.langJson),/* 国际化处理： 多语字段*/
                dataIndex: "resid",
                width: "15%",
                render: (text, record) =>
                    this.renderColumns(text, record, "resid")
            }
        ];
        this.cacheData;
    }
    // 按钮起停用
    btnActive = record => {
        record.isenable = !record.isenable;
        Ajax({
            url: `/nccloud/platform/appregister/editbutton.do`,
            info: {
                name: langCheck('101818AM-000061',"pages", this.props.langJson),/* 国际化处理： 应用管理*/
                action: langCheck('101818AM-000105',"pages", this.props.langJson)/* 国际化处理： 按钮启停用*/
            },
            data: record,
            success: ({ data: { data } }) => {
                if (data.msg) {
                    let { appButtonVOs, setPageButtonData } = this.props;
                    appButtonVOs = appButtonVOs.map(item => {
                        if (item.pk_btn === record.pk_btn) {
                            item = record;
                        }
                        return item;
                    });
                    setPageButtonData(appButtonVOs);
                }
            }
        });
    };
    renderColumns(text, record, column, type = "input") {
        record = _.cloneDeep(record);
        if (type === "input") {
            if (record.editable) {
                return (
                    <EditableCell
                        value={text}
                        hasError={this.state.iserror}
                        onChange={this.onCellChange(record, column)}
                        onCheck={this.onCellCheck(record, column)}
                    />
                );
            } else {
                return <div>{text}</div>;
            }
        } else if (type === "select") {
            return (
                <EditableSelectCell
                    editable={record.editable}
                    value={text}
                    onChange={value => this.handleChange(value, record, column)}
                    langJson={this.props.langJson}
                />
            );
        }
    }
    /**
     * 单元格编辑校验
     */
    onCellCheck = (record, dataIndex) => {
        return value => {
            const listData = this.getNewData();
            const target = listData.find(
                item =>
                    (item.num !== record.num && item[dataIndex] === value) ||
                    value.length === 0
            );
            if (target) {
                this.setState({ iserror: true });
                return true;
            } else {
                this.setState({ iserror: false });
                return false;
            }
        };
    };
    /**
     * 单元格编辑方法
     */
    onCellChange = (record, column) => {
        return value => {
            let newData = this.getNewData();
            const target = newData.filter(item => record.num === item.num)[0];
            if (target) {
                target[column] = value;
                this.setNewData(newData);
            }
        };
    };
    handleChange(value, record, column) {
        let newData = this.getNewData();
        const target = newData.filter(item => record.num === item.num)[0];
        if (target) {
            target[column] = value;
            this.setNewData(newData);
        }
    }
    getNewData() {
        let activeKey = this.props.pageActiveKey;
        let { appButtonVOs, pageTemplets } = this.props;
        if (activeKey === "1") {
            return _.cloneDeep(appButtonVOs);
        } else if (activeKey === "2") {
            return _.cloneDeep(pageTemplets);
        }
    }
    setNewData(newData) {
        let activeKey = this.props.pageActiveKey;
        if (activeKey === "1") {
            this.props.setPageButtonData(newData);
        } else if (activeKey === "2") {
            this.props.setPageTemplateData(newData);
        }
    }
    render() {
        let { appButtonVOs = [], pageTemplets = [], langJson={} } = this.props;
        return (
            <div>
                <Tabs
                    onChange={activeKey => {
                        this.props.setPageActiveKey(activeKey);
                    }}
                    activeKey={this.props.pageActiveKey}
                >
                    <TabPane tab={langCheck('101818AM-000106',"pages", langJson)} key="1">{/* 国际化处理： 按钮注册*/}
                        <Table
                            bordered
                            locale={{
                                emptyText: <CoverPosotion type='treeCardTable'/>
                            }}
                            pagination={false}
                            rowKey="btnorder"
                            dataSource={appButtonVOs.map((item, index) => {
                                item.num = item.btnorder;
                                return item;
                            })}
                            columns={this.columnsBtn}
                            size="middle"
                        />
                    </TabPane>
                    <TabPane tab={langCheck('101818AM-000107',"pages", langJson)} key="2">{/* 国际化处理： 页面模板注册*/}
                        <Table
                            bordered
                            locale={{
                                emptyText: <CoverPosotion type='treeCardTable'/>
                            }}
                            pagination={false}
                            rowKey="num"
                            dataSource={pageTemplets.map((item, index) => {
                                item.num = index + 1;
                                return item;
                            })}
                            columns={this.columnsSt}
                            size="middle"
                        />
                    </TabPane>
                </Tabs>
            </div>
        );
    }
}
PageTable.propTypes = {
    isNew: PropTypes.bool.isRequired,
    nodeInfo: PropTypes.object.isRequired,
    nodeData: PropTypes.object.isRequired,
    appButtonVOs: PropTypes.array.isRequired,
    pageTemplets: PropTypes.array.isRequired,
    setPageTemplateData: PropTypes.func.isRequired,
    setPageButtonData: PropTypes.func.isRequired,
    setPageActiveKey: PropTypes.func.isRequired
};
export default connect(
    state => {
        return {
            isNew: state.AppManagementData.isNew,
            nodeData: state.AppManagementData.nodeData,
            nodeInfo: state.AppManagementData.nodeInfo,
            pageTemplets: state.AppManagementData.pageTemplets,
            appButtonVOs: state.AppManagementData.appButtonVOs,
            pageActiveKey: state.AppManagementData.pageActiveKey,
            langJson:state.AppManagementData.langJson
        };
    },
    { setPageButtonData, setPageTemplateData, setPageActiveKey }
)(withRouter(PageTable));
