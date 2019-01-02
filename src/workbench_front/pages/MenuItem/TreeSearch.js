import React, { Component } from "react";
import { Tree, Input } from "antd";
import Svg from "Components/Svg";
import { createTree } from "Pub/js/createTree.js";
import { langCheck } from "Pub/js/utils";
const TreeNode = Tree.TreeNode;
class TreeSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            searchValue: "",
            autoExpandParent: false,
        };
    }
    /**
     * 树节点展开事件
     */
    onExpand = expandedKeys => {
        expandedKeys = expandedKeys.concat(["00"]);
        this.props.setExpandedKeys(expandedKeys);
        this.setState({
            autoExpandParent: false
        });
    };
    /**
     * 查询框值改变事件
     */
    onChange = e => {
        const value = e.target.value;
        this.setState({ searchValue: value }, () => {
            this.props.onSearch(value, this.handleExpanded);
        });
    };
    /**
     * 查询后展开满足条件的树节点
     */
    handleExpanded = dataList => {
        if (this.state.searchValue.length > 0) {
            const expandedKeys = dataList.map((item, index) => {
                return item.menuitemcode;
            });
            this.props.setExpandedKeys(expandedKeys);
        } else {
            this.props.setExpandedKeys(["00"]);
        }
        this.setState({
            autoExpandParent: true
        });
    };
    /**
     * 查询框删除按钮
     */
    handleSearchDel = () => {
        this.setState({ searchValue: "" }, () => {
            this.props.onSearch("", this.handleExpanded);
        });
    };
    /**
     * 树选中节点事件
     */
    handleSelect = selectedKey => {
        if (selectedKey.length === 0) {
            return;
        }
        this.props.setSelectedKeys(selectedKey);
    };
    /**
     * 双击展开
     */
    hanldeDoubleClick = (e, node) => {
        let nodeDataMenuitemcode = node.props.refData.menuitemcode;
        let expandedKeys = this.props.expandedKeys.concat([
            nodeDataMenuitemcode
        ]);
        this.props.setExpandedKeys(expandedKeys);
    };
    render() {
        let langMultiData = this.props.langMultiData;
        const { searchValue, autoExpandParent } = this.state;
        const loop = data =>
            data.map(item => {
                let { menuitemcode, menuitemname } = item;
                let itemContent;
                if (menuitemcode === "00") {
                    itemContent = `${menuitemname}`;
                } else {
                    itemContent = `${menuitemcode} ${menuitemname}`;
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
                            key={menuitemcode}
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
                        key={menuitemcode}
                        title={title}
                        refData={item}
                    />
                );
            });
        let newTreeData = [
            {
                /* 给树填个根 */
                menuitemname: langCheck(
                    "102202MENU-000048",
                    true,
                    langMultiData
                ) /* 国际化处理： 菜单树*/,
                menuitemcode: "00",
                children: createTree(
                    this.props.dataSource,
                    "menuitemcode",
                    "parentcode"
                )
            }
        ];
        return (
            <div className="menuitem-tree-search">
                <div className="fixed-search-input">
                    <Input
                        value={searchValue}
                        placeholder={langCheck(
                            "102202MENU-000049",
                            true,
                            langMultiData
                        )} /* 国际化处理： 查询应用*/
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
                        expandedKeys={this.props.expandedKeys}
                        selectedKeys={this.props.selectedKeys}
                        onSelect={this.handleSelect}
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
export default TreeSearch;
