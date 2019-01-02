import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Tree, Input } from "antd";
import Svg from "Components/Svg";
import { createTree } from "Pub/js/createTree.js";
import { langCheck } from 'Pub/js/utils';
import {
    setExpandedKeys,
    setSelectedKeys,
    setPageActiveKey
} from "Store/AppManagement/action";
const TreeNode = Tree.TreeNode;
class SearchTree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: "",
            autoExpandParent: true
        };
    }
    onExpand = expandedKeys => {
        this.props.setExpandedKeys(expandedKeys);
        this.setState({
            autoExpandParent: false
        });
    };
    /**
     * 查询框值改变
     */
    onChange = e => {
        const value = e.target.value;
        this.setState({ searchValue: value }, () => {
            this.props.onSearch(value);
        });
    };
    /**
     * 查询框删除按钮
     */
    handleSearchDel = () => {
        this.setState({ searchValue: "" }, () => {
            this.props.onSearch("");
        });
    };
    // handleExpanded = dataList => {
    //     const expandedKeys = dataList.map(item => {
    //         return item.code;
    //     });
    //     this.props.setExpandedKeys(expandedKeys);
    //     this.setState({
    //         autoExpandParent: true
    //     });
    // };
    /**
     * 树节点选中事件
     * @param {Array} selectedKey
     */
    handleSelect = (selectedKey, info) => {
        if (selectedKey.length === 0) {
            return;
        }
        let selectedNode;
        if (info["selectedNodes"].length > 0) {
            selectedNode = info["selectedNodes"][0]["props"]["refData"];
        }
        this.props.setSelectedKeys(selectedKey);
        // 当树节点切换时 重置 页面节点 激活页签
        this.props.setPageActiveKey("1");
        // 为父组件返回选中的树节点对象
        this.props.onSelect(selectedNode);
    };
    /**
     * 双击展开
     */
    hanldeDoubleClick = (e, node) => {
        let nodeDataMduleid = node.props.refData.moduleid;
        let expandedKeys = this.props.expandedKeys.concat([nodeDataMduleid]);
        this.props.setExpandedKeys(expandedKeys);
    };
    render() {
        const { searchValue, autoExpandParent } = this.state;
        let expandedKeys = this.props.expandedKeys;
        let selectedKeys = this.props.selectedKeys;
        let langJson=this.props.langJson;
        const loop = data =>
            data.map(item => {
                let {
                    flag,
                    moduleid: code,
                    systypename: name,
                    systypecode
                } = item;
                let itemContent;
                if (code === "00") {
                    itemContent = `${name}`;
                } else {
                    if (flag - 0 === 0 || flag - 0 === 1) {
                        itemContent = `${code} ${name}`;
                    } else {
                        itemContent = `${systypecode} ${name}`;
                    }
                }
                const index = itemContent.indexOf(searchValue);
                const beforeStr = itemContent.substr(0, index);
                const afterStr = itemContent.substr(index + searchValue.length);
                const title =
                    index > -1 ? (
                        <span>
                            {beforeStr}
                            <span style={{ color: "#f50" }}>{searchValue}</span>
                            {afterStr}
                        </span>
                    ) : (
                        <span>{itemContent}</span>
                    );
                if (item.children) {
                    return (
                        <TreeNode
                            icon={({ expanded }) => {
                                return (
                                    <Svg
                                        width={20}
                                        height={20}
                                        xlinkHref={
                                            expanded
                                                ? "#icon-wenjianjiadakai"
                                                : "#icon-wenjianjia"
                                        }
                                    />
                                );
                            }}
                            switcherIcon={({ expanded }) => {
                                return (
                                    <i
                                        className={`font-size-18 iconfont ${
                                            expanded
                                                ? "icon-shu_zk"
                                                : "icon-shushouqi"
                                        }`}
                                    />
                                );
                            }}
                            key={code}
                            title={title}
                            refData={item}
                        >
                            {loop(item.children)}
                        </TreeNode>
                    );
                }
                return (
                    <TreeNode
                        icon={<span className="tree-dot" />}
                        key={code}
                        title={title}
                        refData={item}
                    />
                );
            });
        let newTreeData = [
            {
                /* 给树填个根 */
                systypename: langCheck('101818AM-000108',"pages",langJson),/* 国际化处理： 应用节点*/
                moduleid: "00",
                children: createTree(
                    this.props.treeData,
                    "moduleid",
                    "parentcode"
                )
            }
        ];
        return (
            <div className={`${this.props.className}`}>
                <div className="fixed-search-input">
                    <Input
                        placeholder={langCheck('101818AM-000068',"pages",langJson)}/* 国际化处理： 应用查询*/
                        value={searchValue}
                        onChange={this.onChange}
                        suffix={
                            searchValue.length > 0 ? (
                                <span className="fixed-search-icon-group">
                                    <i
                                        className="iconfont icon-qingkong"
                                        onClick={this.handleSearchDel}
                                    />
                                    <i className="iconfont icon-sousuo" />
                                </span>
                            ) : (
                                <span className="fixed-search-icon-group">
                                    <i className="iconfont icon-sousuo" />
                                </span>
                            )
                        }
                    />
                </div>
                <div className="tree-content workbench-scroll">
                    <Tree
                        showLine
                        showIcon
                        onExpand={this.onExpand}
                        expandedKeys={expandedKeys}
                        onSelect={this.handleSelect}
                        selectedKeys={selectedKeys}
                        autoExpandParent={autoExpandParent}
                        onDoubleClick={this.hanldeDoubleClick}
                    >
                        {loop(newTreeData)}
                    </Tree>
                </div>
            </div>
        );
    }
}
SearchTree.propTypes = {
    treeData: PropTypes.array.isRequired,
    expandedKeys: PropTypes.array.isRequired,
    selectedKeys: PropTypes.array.isRequired,
    setExpandedKeys: PropTypes.func.isRequired,
    setSelectedKeys: PropTypes.func.isRequired,
    setPageActiveKey: PropTypes.func.isRequired
};
export default connect(
    state => ({
        treeData: state.AppManagementData.treeData,
        expandedKeys: state.AppManagementData.expandedKeys,
        selectedKeys: state.AppManagementData.selectedKeys,
        langJson:state.AppManagementData.langJson
    }),
    { setExpandedKeys, setSelectedKeys, setPageActiveKey }
)(SearchTree);
