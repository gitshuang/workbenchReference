import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Tree } from "antd";
import { createTree } from "Pub/js/createTree.js";
import { Pad } from "Pub/js/utils";
import Svg from "Components/Svg";
import { setCopyNodeData } from "Store/AppManagement/action.js";
const TreeNode = Tree.TreeNode;
class MenuTree extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedKeys: [],
            expandedKeys: []
        };
    }
    handleSelect = (selectedKeys, info) => {
        let selectedNode;
        if (info["selectedNodes"].length > 0) {
            let expandedKeys = Array.from(
                new Set(this.state.expandedKeys.concat(selectedKeys))
            );
            this.setState({ expandedKeys });
            selectedNode = info["selectedNodes"][0]["props"]["refData"];
            if (selectedNode.refcode.length !== 6) {
                return;
            }
            let newMenuItemCode = `${selectedNode.refcode + Pad(1, 2)}`;
            if (selectedNode.children && selectedNode.children.length > 0) {
                newMenuItemCode = `${selectedNode.refcode +
                    Pad(selectedNode.children.length, 2)}`;
            }
            this.props.form.setFieldsValue({
                newMenuItemCode: newMenuItemCode
            });
            this.setState({ selectedKeys });
        }
    };
    handleExpand = expandedKeys => {
        this.setState({
            expandedKeys
        });
    };
    render() {
        const loop = data =>
            data.map(item => {
                let { refcode: code, refname: name } = item;
                let itemContent = `${code} ${name}`;
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
        let newTreeData = createTree(this.props.menuTreeData, "refcode", "pid");
        return (
            <Tree
                showLine
                showIcon
                onSelect={this.handleSelect}
                selectedKeys={this.state.selectedKeys}
                onExpand={this.handleExpand}
                expandedKeys={this.state.expandedKeys}
            >
                {loop(newTreeData)}
            </Tree>
        );
    }
}
MenuTree.propTypes = {
    menuTreeData: PropTypes.array.isRequired,
    copyNodeData: PropTypes.object.isRequired,
    setCopyNodeData: PropTypes.func.isRequired
};
export default connect(
    state => ({
        menuTreeData: state.AppManagementData.menuTreeData,
        copyNodeData: state.AppManagementData.copyNodeData
    }),
    { setCopyNodeData }
)(MenuTree);
