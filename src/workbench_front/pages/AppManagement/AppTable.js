import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Tabs, Table } from 'antd';
import _ from 'lodash';
import { setAppParamData } from 'Store/AppManagement/action';
import EditableCell from 'Components/EditableCell';
import CoverPosotion from 'Components/CoverPosition';
import { langCheck } from 'Pub/js/utils';
const TabPane = Tabs.TabPane;
class AppTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            iserror: false
        };
        this.columnsPar = [
            {
                title: langCheck('101818AM-000057', 'pages', props.langJson) /* 国际化处理： 序号*/,
                dataIndex: 'num',
                width: '5%'
            },
            {
                title: langCheck('101818AM-000058', 'pages', props.langJson) /* 国际化处理： 参数名称*/,
                dataIndex: 'paramname',
                width: '25%',
                render: (text, record) => this.renderColumns(text, record, 'paramname')
            },
            {
                title: langCheck('101818AM-000059', 'pages', props.langJson) /* 国际化处理： 参数值*/,
                width: '55%',
                dataIndex: 'paramvalue',
                render: (text, record) => this.renderColumns(text, record, 'paramvalue')
            }
        ];
        this.cacheData;
    }
    renderColumns(text, record, column) {
        record = _.cloneDeep(record);
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
    }
    /**
     * 单元格编辑校验
     */
    onCellCheck = (record, dataIndex) => {
        return (value) => {
            const listData = this.getNewData();
            const target = listData.find(
                (item) => (item.num !== record.name && item[dataIndex] === value) || value.length === 0
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
    onCellChange = (record, column) => {
        return (value) => {
            let newData = this.getNewData();
            const target = newData.filter((item) => record.num === item.num)[0];
            if (target) {
                target[column] = value;
                this.props.setAppParamData(newData);
            }
        };
    };
    getNewData() {
        let appParamVOs = this.props.appParamVOs;
        return _.cloneDeep(appParamVOs);
    }
    render() {
        let appParamVOs = this.props.appParamVOs;
        let { langJson } = this.props;
        return (
            <Tabs activeKey='1'>
                <TabPane tab={langCheck('101818AM-000060', 'pages', langJson)} key='1'>
                    {/* 国际化处理： 参数注册*/}
                    <Table
                        bordered
                        locale={{
                            emptyText: <CoverPosotion type='treeCardTable' />
                        }}
                        pagination={false}
                        rowKey='num'
                        dataSource={appParamVOs.map((item, index) => {
                            item.num = index + 1;
                            return item;
                        })}
                        columns={this.columnsPar}
                        size='middle'
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
    (state) => ({
        isNew: state.AppManagementData.isNew,
        nodeInfo: state.AppManagementData.nodeInfo,
        nodeData: state.AppManagementData.nodeData,
        appParamVOs: state.AppManagementData.appParamVOs,
        langJson: state.AppManagementData.langJson
    }),
    { setAppParamData }
)(AppTable);
