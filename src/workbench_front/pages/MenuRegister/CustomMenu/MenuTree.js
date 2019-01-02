import React, { Component } from "react";
import { Tree } from "antd";
import { createTree } from "Pub/js/createTree.js";
import Svg from "Components/Svg";
const TreeNode = Tree.TreeNode;
class MenuTree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expandedKeys: ["00"],
            autoExpandParent: true
        };
    }
    /**
     * 树展开节点
     */
    handleOnExpand = expandedKeys => {
        expandedKeys = Array.from(new Set(expandedKeys.concat(["00"])));
        this.setState({
            expandedKeys,
            autoExpandParent: false
        });
    };
    /**
     * 树节点选择
     */
    handleSelect = (selectedKeys, e) => {
        if (selectedKeys.length > 0 && selectedKeys[0] !== "00") {
            this.setState({
                selectedKeys
            });
            // console.log(selectedKeys);
            this.props.setSelectedKeys(selectedKeys);
            this.props.setSelectedTreeNode(e.node.props.refData);
        }
    };
    /**
     * 双击展开
     */
    hanldeDoubleClick = (e, node) => {
        let menucode = node.props.refData.code;
        let expandedKeys = this.state.expandedKeys.concat([menucode]);
        this.setState({
            expandedKeys
        });
    };
    render() {
        const { expandedKeys, autoExpandParent } = this.state;
        const loop = data =>
            data.map(item => {
                let { code, name } = item;
                let itemContent;
                if (code === "00") {
                    itemContent = `${name}`;
                } else {
                    itemContent = `${code} ${name}`;
                }
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
                            title={itemContent}
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
                        title={itemContent}
                        refData={item}
                    />
                );
            });
        let newTreeData = [
            {
                /* 给树填个根 */
                name: this.props.title,
                code: "00",
                children: createTree(this.props.dataSource, "code", "pid")
            }
        ];
        return (
            <div className="menutree-container">
                <div className="title">{this.props.title}</div>
                <div className="menutree-content workbench-scroll">
                    <Tree
                        showLine
                        showIcon
                        onExpand={this.handleOnExpand}
                        expandedKeys={expandedKeys}
                        onSelect={this.handleSelect}
                        selectedKeys={this.props.selectedKeys}
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
export default MenuTree;
