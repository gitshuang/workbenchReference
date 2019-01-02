import React, { Component } from "react";
import { Button } from "antd";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import _ from "lodash";
import { setGetSelectedTreeDataFun } from "Store/MenuRegister/action";
import Ajax from "Pub/js/ajax";
import MenuTree from "./MenuTree";
import { langCheck } from "Pub/js/utils";
class TreeTransfer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            leftMenuItemVOs: [],
            rightMenuItemVOs: [],
            leftSelectedNodes: [],
            rightSelectedNodes: [],
            leftSelectedKeys: [],
            rightSelectedKeys: [],
            leftWipeOff: [],
            rightWipeOff: []
        };
    }
    /**
     * 获取右侧树数据
     */
    getRightTreeData = () => {
        return this.state.rightMenuItemVOs;
    };
    /**
     * 设置左侧树数据
     */
    setLeftTreeData = treeData => {
        this.setState({
            leftMenuItemVOs: treeData
        });
    };
    /**
     * 设置右侧树数据
     */
    setRightTreeData = treeData => {
        this.setState({
            rightMenuItemVOs: treeData
        });
    };
    /**
     * 设置左侧选中树节点数据
     */
    setLeftSelectedNodes = nodeData => {
        let dataReduction = DataReduction(nodeData);
        let leftSelectedNodes = ArrayToHeavy(
            FindParentNodeData(nodeData.pid, this.state.leftMenuItemVOs),
            dataReduction
        );
        this.setState({
            leftSelectedNodes,
            leftWipeOff: dataReduction
        });
    };
    /**
     * 设置右侧选中树节点数据
     */
    setRightSelectedNodes = nodeData => {
        let dataReduction = DataReduction(nodeData);
        let rightSelectedNodes = ArrayToHeavy(
            FindParentNodeData(nodeData.pid, this.state.rightMenuItemVOs),
            dataReduction
        );
        this.setState({
            rightSelectedNodes,
            rightWipeOff: dataReduction
        });
    };
    /**
     *树选中节点事件
     */
    setSleectedKeys = key => {
        switch (key) {
            case "left":
                return array => {
                    this.setState({
                        leftSelectedKeys: array
                    });
                };
            case "right":
                return array => {
                    this.setState({
                        rightSelectedKeys: array
                    });
                };
            default:
                break;
        }
    };
    /**
     * 穿梭按钮点击事件
     */
    handleButtonClick = key => {
        let {
            rightMenuItemVOs,
            leftMenuItemVOs,
            rightSelectedNodes,
            leftSelectedNodes,
            leftSelectedKeys,
            rightSelectedKeys,
            leftWipeOff,
            rightWipeOff
        } = this.state;
        switch (key) {
            case "toRight":
                rightMenuItemVOs = _.sortBy(
                    ArrayToHeavy(rightMenuItemVOs, leftSelectedNodes),
                    [
                        function(o) {
                            return o.code;
                        }
                    ]
                );
                leftSelectedNodes = [];
                leftSelectedKeys = [];
                leftMenuItemVOs = _.xorWith(
                    leftMenuItemVOs,
                    leftWipeOff,
                    _.isEqual
                );
                break;
            case "rightTransfer":
                rightMenuItemVOs = _.sortBy(
                    ArrayToHeavy(rightMenuItemVOs, leftMenuItemVOs),
                    [
                        function(o) {
                            return o.code;
                        }
                    ]
                );
                leftSelectedNodes = [];
                leftSelectedKeys = [];
                leftMenuItemVOs = [];
                break;
            case "leftTransfer":
                leftMenuItemVOs = _.sortBy(
                    ArrayToHeavy(leftMenuItemVOs, rightMenuItemVOs),
                    [
                        function(o) {
                            return o.code;
                        }
                    ]
                );
                rightSelectedNodes = [];
                rightSelectedKeys = [];
                rightMenuItemVOs = [];
                break;
            case "toLeft":
                leftMenuItemVOs = _.sortBy(
                    ArrayToHeavy(leftMenuItemVOs, rightSelectedNodes),
                    [
                        function(o) {
                            return o.code;
                        }
                    ]
                );
                rightSelectedNodes = [];
                rightSelectedKeys = [];
                rightMenuItemVOs = _.xorWith(
                    rightMenuItemVOs,
                    rightWipeOff,
                    _.isEqual
                );
                break;
            default:
                break;
        }
        this.setState({
            rightMenuItemVOs,
            leftMenuItemVOs,
            rightSelectedNodes,
            leftSelectedNodes,
            leftSelectedKeys,
            rightSelectedKeys
        });
    };
    componentDidMount() {
        let langMultiData = this.props.langMultiData;
        this.props.setGetSelectedTreeDataFun(this.getRightTreeData);
        Ajax({
            url: `/nccloud/platform/appregister/upgradedefappmenu.do`,
            info: {
                name: langCheck(
                    "102202MENU-000032",
                    true,
                    langMultiData
                ) /* 国际化处理： 菜单自定义升级*/,
                action: langCheck(
                    "102202MENU-000033",
                    true,
                    langMultiData
                ) /* 国际化处理： 查询*/
            },
            data: {
                pk_menu: this.props.menuId
            },
            success: ({ data: { data } }) => {
                if (data) {
                    if (!data.leftMenuItemVOs) {
                        data.leftMenuItemVOs = [];
                    }
                    if (!data.rightMenuItemVOs) {
                        data.rightMenuItemVOs = [];
                    }
                    this.setState({ ...data });
                    this.HISTORYTREEDATA = { ...data };
                }
            }
        });
    }
    render() {
        let {
            leftMenuItemVOs,
            rightMenuItemVOs,
            leftSelectedKeys,
            rightSelectedKeys
        } = this.state;
        let langMultiData = this.props.langMultiData;
        return (
            <div className="tree-transfer-container">
                <div className="tree-transfer-left">
                    <MenuTree
                        dataSource={leftMenuItemVOs}
                        title={langCheck(
                            "102202MENU-000034",
                            true,
                            langMultiData
                        )} /* 国际化处理： 待选择数据*/
                        setSelectedTreeNode={this.setLeftSelectedNodes}
                        selectedKeys={leftSelectedKeys}
                        setSelectedKeys={this.setSleectedKeys("left")}
                    />
                </div>
                <div className="tree-transfer-buttons">
                    <Button
                        className="transfer-right "
                        onClick={() => {
                            this.handleButtonClick("toRight");
                        }}
                    >
                        <i className="iconfont icon-jiantouyou" />
                    </Button>
                    <Button
                        className="transfer-right-double margin-top-8"
                        onClick={() => {
                            this.handleButtonClick("rightTransfer");
                        }}
                    >
                        <i className="transfer-icon-1 iconfont icon-jiantouyou" />
                        <i className="transfer-icon-2 iconfont icon-jiantouyou" />
                    </Button>
                    <Button
                        className="transfer-left-double margin-top-25"
                        onClick={() => {
                            this.handleButtonClick("leftTransfer");
                        }}
                    >
                        <i className="transfer-icon-1 iconfont icon-jiantouzuo" />
                        <i className="transfer-icon-2 iconfont icon-jiantouzuo" />
                    </Button>
                    <Button
                        className="transfer-left margin-top-8"
                        onClick={() => {
                            this.handleButtonClick("toLeft");
                        }}
                    >
                        <i className="iconfont icon-jiantouzuo" />
                    </Button>
                </div>
                <div className="tree-transfer-right">
                    <MenuTree
                        dataSource={rightMenuItemVOs}
                        title={langCheck(
                            "102202MENU-000035",
                            true,
                            langMultiData
                        )} /* 国际化处理： 已选择数据*/
                        setSelectedTreeNode={this.setRightSelectedNodes}
                        selectedKeys={rightSelectedKeys}
                        setSelectedKeys={this.setSleectedKeys("right")}
                    />
                </div>
            </div>
        );
    }
}
TreeTransfer.propsTypes = {
    menuId: PropTypes.string.isRequired,
    setGetSelectedTreeDataFun: PropTypes.func.isRequired
};
export default connect(
    ({ menuRegisterData }) => ({ menuId: menuRegisterData.menuId }),
    { setGetSelectedTreeDataFun }
)(TreeTransfer);
/**
 * 数据简化整理
 * @param {*} data
 */
const DataReduction = data => {
    data = _.cloneDeep(data);
    let DATAARRAY = [];
    const reductionFun = data => {
        DATAARRAY.push(data);
        let dataItem = data.children;
        delete data.children;
        if (dataItem && dataItem.length > 0) {
            let len = dataItem.length;
            for (let index = 0; index < len; index++) {
                const element = dataItem[index];
                reductionFun(element);
            }
        }
    };
    reductionFun(data);
    return DATAARRAY;
};
/**
 * 查找所选节点父节点数组
 * @param {String} key 父节点编码
 * @param {Array} array 树数组
 */
const FindParentNodeData = (key, array) => {
    let parentArray = [];
    const findParentNodeFun = (pidKey, treeArray) => {
        let obj = treeArray.find(item => item.code === pidKey);
        if (obj) {
            parentArray.push(obj);
            if (obj.pid) {
                findParentNodeFun(obj.pid, treeArray);
            }
        }
    };
    findParentNodeFun(key, array);
    return parentArray;
};
/**
 * 数组合并去重
 * @param {Array} array1
 * @param {Array} array2
 */
const ArrayToHeavy = (array1, array2) => {
    return _.uniqBy(array1.concat(array2), "code");
};
