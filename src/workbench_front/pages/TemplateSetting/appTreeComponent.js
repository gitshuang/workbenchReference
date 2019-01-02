import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    setExpandedKeys,
    setSelectedKeys,
    setDef1,
    setSearchValue,
    setPageCode,
    setAppCode
} from 'Store/TemplateSetting/action';
import { Tree, Input } from 'antd';
import { createTree } from 'Pub/js/createTree';
import { langCheck } from 'Pub/js/utils';
import loop from './loop';
const Search = Input.Search;

class TreeComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            autoExpandParent: false
        };
    }
    componentDidMount() {}
    onExpand = (expandedKeys) => {
        this.props.setExpandedKeys(expandedKeys);
        this.setState({
            autoExpandParent: false
        });
    };
    //tree的查询方法
    onChange = (e) => {
        const value = e.target.value;
        if (value) {
            this.props.setSearchValue(value);
            this.props.handleSearch(value, this.props.handleExpanded);
        } else {
            this.props.reqTreeData(this.props.setInforFun);
            const expandedKeys = [ '00' ];
            this.props.setExpandedKeys(expandedKeys);
            this.props.setSearchValue('');
        }
    };
    //加载右侧模板数据
    onSelectQuery = (key, e) => {
        let { selectedKeys } = this.props;
        if (key.length > 0) {
            this.props.setSelectedKeys(key);
            this.props.setDef1(e.selectedNodes[0].props.refData.def1);
            this.props.setAppCode(e.selectedNodes[0].props.refData.appCode);
            this.props.setPageCode(e.selectedNodes[0].props.refData.code);
            this.setState(
                {
                    autoExpandParent: true
                },
                this.props.onSelect
            );
        } else {
            if (selectedKeys) {
                this.props.onSelect();
            }
        }
    };
    //树的双击事件回调方法
    hanldeDoubleClick = (node) => {
        let nodeDataoMduleid;
        let expandedKeys = [];
        nodeDataoMduleid = node.props.refData.pk;
        expandedKeys = this.props.expandedKeys.concat([ nodeDataoMduleid ]);
        this.props.setExpandedKeys(expandedKeys);
    };
    /**
     * 查询框删除按钮
     */
    handleSearchDel = () => {
        this.props.reqTreeData(this.props.setInforFun);
        const expandedKeys = [ '00' ];
        this.props.setExpandedKeys(expandedKeys);
        this.props.setSearchValue('');
    };
    render() {
        const {
            autoExpandParent
        } = this.state;
        let {
            expandedKeys,
            selectedKeys,
            searchValue,
            json
        } = this.props;
        const treeData = [
            {
                code: '00',
                name: langCheck('10180TM-000000', "pages", json),/* 国际化处理： 菜单树*/
                pk: '00',
                children: createTree(this.props.treeData, 'code', 'pid')
            }
        ];
        return (
            <div className='templateSetting-searchTree workbench-scroll'>
                    <div className='fixed-search-input'>
                        <Search
                            placeholder={langCheck('10180TM-000001', "pages", json)}/* 国际化处理： 搜索菜单树*/
                            onChange={this.onChange}
                            value={searchValue}
                            suffix={
                                searchValue.length > 0 ? (
                                    <i className='iconfont icon-qingkong' onClick={this.handleSearchDel} />
                                ) : (
                                    ''
                                )
                            }
                        />
                    </div>
                {treeData.length > 0 && (
                    <Tree
                        showLine
                        showIcon
                        onExpand={(key, node) => {
                            this.onExpand(key, node);
                        }}
                        expandedKeys={expandedKeys}
                        onSelect={(key, node) => {
                            this.onSelectQuery(key, node);
                        }}
                        autoExpandParent={autoExpandParent}
                        selectedKeys={selectedKeys}
                        onDoubleClick={(key, node) => {
                            this.hanldeDoubleClick(node);
                        }}
                    >
                        {loop(treeData, searchValue)}
                    </Tree>
                )}
            </div>
        );
    }
}

TreeComponent.propTypes = {
    treeData: PropTypes.array.isRequired,
    setExpandedKeys: PropTypes.func.isRequired,
    setSelectedKeys: PropTypes.func.isRequired,
    setDef1: PropTypes.func.isRequired,
    setTreeTemPrintData: PropTypes.func.isRequired,
    setSearchValue: PropTypes.func.isRequired,
    setPageCode: PropTypes.func.isRequired,
    setAppCode: PropTypes.func.isRequired,
    selectedKeys: PropTypes.array.isRequired,
    expandedKeys: PropTypes.array.isRequired,
    searchValue: PropTypes.string.isRequired,
    pageCode: PropTypes.string.isRequired,
    json: PropTypes.object.isRequired
};
export default connect(
    (state) => ({
        treeData: state.TemplateSettingData.treeData,
        selectedKeys: state.TemplateSettingData.selectedKeys,
        expandedKeys: state.TemplateSettingData.expandedKeys,
        searchValue: state.TemplateSettingData.searchValue,
        json: state.TemplateSettingData.json
    }),
    {
        setExpandedKeys,
        setSelectedKeys,
        setDef1,
        setSearchValue,
        setPageCode,
        setAppCode
    }
)(TreeComponent);
