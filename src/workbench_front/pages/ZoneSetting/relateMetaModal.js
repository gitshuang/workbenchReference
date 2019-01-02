import React, { Component } from "react";
import _ from "lodash";
import Ajax from "Pub/js/ajax";
import { connect } from "react-redux";
import { Icon, Tree, Modal, Button } from "antd";
import Svg from "Components/Svg";
import { langCheck } from "Pub/js/utils";
import { getMulti } from 'Pub/js/getMulti';
import {
    PageLayout,
    PageLayoutLeft,
    PageLayoutRight
} from "Components/PageLayout";
const TreeNode = Tree.TreeNode;
//元数据编辑关联项模态框组件类
class RelateMetaModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            metaTree: [],
            selectTreeNodes: [],
            json: {}
        };
    }
    //异步元数据树的展开请求
    onLoadData = treeNode => {
        let { json } = this.state;
        return new Promise(resolve => {
            if (treeNode.props.children) {
                resolve();
                return;
            }
            Ajax({
                url: `/nccloud/platform/templet/querymetapro.do`,
                info: {
                    name: langCheck('ZoneSetting-000017', 'pages', json),/* 国际化处理： 单据模板设置*/
                    action: langCheck('ZoneSetting-000020', 'pages', json)/* 国际化处理： 元数据树结构查询*/
                },
                data: {
                    // metaid: metaid
                    metaid: treeNode.props.refpk
                },
                success: res => {
                    if (res) {
                        let { data, success } = res.data;
                        if (
                            success &&
                            data &&
                            data.rows &&
                            data.rows.length > 0
                        ) {
                            let metaTree = [];
                            data.rows.map((r, index) => {
                                metaTree.push({
                                    ...r,
                                    title: `${r.refcode} ${r.refname}`,
                                    key: `${treeNode.props.myUniqID}.${
                                        r.refcode
                                    }`,
                                    myUniqID: `${treeNode.props.myUniqID}.${
                                        r.refcode
                                    }`,
                                    isLeaf: r.isleaf
                                });
                            });
                            treeNode.props.dataRef.children = [].concat(
                                metaTree
                            );
                            this.setState({
                                metaTree: [...this.state.metaTree]
                            });
                            resolve();
                        }
                    }
                }
            });
        });
    };
    //进行字符串分割，分割出模态框右侧列表中的的key和value值
    componentWillReceiveProps(nextProps) {
        let { json } = this.state;
        if (nextProps.modalVisibel !== true) {
            return;
        } else {
            const { metaid, relatemeta } = this.props.selectCard;
            let { cards } = this.props;
            if (relatemeta && relatemeta !== "") {
                let tmpArr1 = relatemeta.split(",");
                let tmpArr2 = [];
                //循环分割出来的数据，再次分割出列表需要的数据{列表code和元数据路径myMetaPath}
                _.forEach(tmpArr1, t => {
                    let tmpArr = t.split("=");
                    tmpArr2.push({
                        code: tmpArr[0],
                        myMetaPath: tmpArr[1]
                    });
                });
                //循环遍历所有列表中每行数据，设置上元数据路径；
                _.forEach(cards, (c, index) => {
                    _.forEach(tmpArr2, t => {
                        if (t.code === c.code) {
                            c.myMetaPath = t.myMetaPath;
                        }
                    });
                });
            }
            Ajax({
                url: `/nccloud/platform/templet/querymetapro.do`,
                info: {
                    name: langCheck('ZoneSetting-000017', 'pages', json),/* 国际化处理： 单据模板设置*/
                    action: langCheck('ZoneSetting-000020', 'pages', json)/* 国际化处理： 元数据树结构查询*/
                },
                data: {
                    metaid: metaid
                },
                success: res => {
                    if (res) {
                        let { data, success } = res.data;
                        if (
                            success &&
                            data &&
                            data.rows &&
                            data.rows.length > 0
                        ) {
                            let metaTree = [];
                            data.rows.map((r, index) => {
                                metaTree.push({
                                    ...r,
                                    title: `${r.refcode} ${r.refname}`,
                                    key: `${r.refcode}`,
                                    myUniqID: `${r.refcode}`,
                                    isLeaf: r.isleaf
                                });
                            });
                            this.setState({ metaTree: metaTree });
                        } else {
                            if (
                                success &&
                                data &&
                                data.rows &&
                                !data.rows.length
                            ) {
                                Notice({
                                    status: "warning",
                                    msg: langCheck('ZoneSetting-000021', 'pages', json)/* 国际化处理： 元数据树为空*/
                                });
                            }
                        }
                    }
                }
            });
        }
    }
    //隐藏元数据编辑关联项模态框
    showModalHidden = () => {
        let { cards } = this.props;
        _.forEach(cards, (c, i) => {
            if (c.myMetaPath && c.myMetaPath !== "") {
                c.myMetaPath = "";
            }
        });
        this.props.setModalVisibel("relateMetaModalVisibel", false);
    };
    //字符串拼接，设置relatemeta，{卡片编码，元数据路径}
    onOkDialog = () => {
        let result = "";
        let { cards } = this.props;
        _.forEach(cards, (c, i) => {
            if (c.myMetaPath && c.myMetaPath !== "") {
                if (result === "") {
                    result = `${c.code}=${c.myMetaPath}`;
                } else {
                    result = `${result},${c.code}=${c.myMetaPath}`;
                }
            }
        });
        this.props.handleSelectChange(result, "relatemeta");
        this.showModalHidden();
    };
    //递归拼接树结构
    renderTreeNodes = data => {
        return data.map(item => {
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
                        title={item.title}
                        key={item.key}
                        dataRef={item}
                    >
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            if (item.isLeaf) {
                return (
                    <TreeNode
                        icon={<span className="tree-dot" />}
                        {...item}
                        dataRef={item}
                    />
                );
            } else {
                return (
                    <TreeNode
                        {...item}
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
                        dataRef={item}
                    />
                );
            }
        });
    };
    //选择某一个树节点
    onSelect = (selectedKeys, info) => {
        this.setState({ selectedKeys, selectTreeNodes: info.selectedNodes });
    };
    //点击模态框右侧的列表某一行，如果数据类型左右侧相等，进行列表中元数据路径的设置
    cardClick = card => {
        let { selectTreeNodes } = this.state;

        if (selectTreeNodes.length > 0) {
            const tmpDataRef = selectTreeNodes[0].props.dataRef;
            if (tmpDataRef.datatype === card.datatype) {
                card.myMetaPath = tmpDataRef.myUniqID;
            } else {
                return;
            }
        } else {
            return;
        }

        this.setState({ selectedKeys: [], selectTreeNodes: [] });
    };
    //删除模态框右侧列表的某一行值
    deleteMyMetaPath = (card, index) => {
        card.myMetaPath = "";
        this.setState({ selectedKeys: [], selectTreeNodes: [] });
    };
    /**
     * 左侧元数据树的选中节点与右侧列表的每一行进行数据类型比对，设置不同透明度
     * @param {String} cardDataType 右侧列表某一行数据的数据类型
     * @param {String} selectTreeDataType 元数据树中被选中的节点的数据类型
     * @return {Number} result 透明度
     */
    getOpacity = (cardDataType, selectTreeDataType) => {
        let result = 1;
        if (selectTreeDataType !== "") {
            if (cardDataType !== selectTreeDataType) {
                result = 0.5;
            }
        }
        return result;
    };
    componentDidMount() {
        //多语
        let callback = (json) => {
			// console.log('json', json);
            this.setState({
                json:json
            });
        };
        getMulti({
            moduleId: 'ZoneSetting',
            // currentLocale: 'zh-CN',
            domainName: 'workbench',
            callback
        });
    }
    render() {
        const { metaTree, selectTreeNodes, json } = this.state;
        const { cards } = this.props;
        let selectTreeNodeDatatype = "";
        if (selectTreeNodes.length > 0) {
            selectTreeNodeDatatype = selectTreeNodes[0].props.dataRef.datatype;
        }
        return (
            <Modal
                closable={false}
                title={
                    <div>
                        {langCheck('ZoneSetting-000071', 'pages', json)}
                        {/* /* 国际化处理： 元数据编辑关联项*/ }
                        <span style={{ fontSize: "13px", marginLeft: "10px" }}>
                            {langCheck('ZoneSetting-000072', 'pages', json)}
                            {/* /* 国际化处理： 请在点击选择左侧树，然后点击选择右侧列表*/ }
                        </span>
                    </div>
                }
                mask={false}
                wrapClassName="realate-meta-modal"
                visible={this.props.modalVisibel}
                onOk={this.onOkDialog}
                destroyOnClose={true}
                onCancel={this.showModalHidden}
                width={"80%"}
                style={{ top: 20 }}
                footer={[
                    <Button
                        key="submit"
                        // disabled={}
                        type="primary"
                        onClick={this.onOkDialog}
                    >
                        {langCheck('ZoneSetting-000005', 'pages', json)}
                        {/* /* 国际化处理： 确定*/ }
                    </Button>,
                    <Button key="back" onClick={this.showModalHidden}>
                        {langCheck('ZoneSetting-000006', 'pages', json)}
                        {/* /* 国际化处理： 取消*/ }
                    </Button>
                ]}
            >
                <PageLayout>
                    <PageLayoutLeft>
                        <div className="sider-tree">
                            <Tree
                                loadData={this.onLoadData}
                                showLine
                                showIcon
                                onSelect={this.onSelect}
                                selectedKeys={this.state.selectedKeys}
                            >
                                {this.renderTreeNodes(metaTree)}
                            </Tree>
                        </div>
                    </PageLayoutLeft>
                    <PageLayoutRight>
                        <div className="sider-list">
                            <table>
                                <thead>
                                    <tr>
                                        <th>{langCheck('ZoneSetting-000073', 'pages', json)}</th>
                                        {/* /* 国际化处理： 列*/ }
                                        <th>{langCheck('ZoneSetting-000074', 'pages', json)}</th>
                                        {/* /* 国际化处理： 元数据路径*/ }
                                    </tr>
                                </thead>
                                <tbody>
                                    {cards.map((c, i) => {
                                        //必须是元数据并且不包含.,也就是根节点或者子表的根节点
                                        //注意：最新逻辑去掉只显示根节点或者子表的根节点的逻辑
                                        if (c.metapath && c.metapath !== "") {
                                            return (
                                                <tr
                                                    key={i}
                                                    onClick={e => {
                                                        this.cardClick(c);
                                                    }}
                                                    style={{
                                                        opacity: this.getOpacity(
                                                            c.datatype,
                                                            selectTreeNodeDatatype
                                                        )
                                                    }}
                                                >
                                                    <td>{c.label}</td>
                                                    {(() => {
                                                        if (
                                                            c.myMetaPath &&
                                                            c.myMetaPath !== ""
                                                        ) {
                                                            return (
                                                                <td>
                                                                    <div className="close-and-text">
                                                                        <Icon
                                                                            type="close"
                                                                            onClick={() => {
                                                                                this.deleteMyMetaPath(
                                                                                    c,
                                                                                    i
                                                                                );
                                                                            }}
                                                                        />
                                                                        &nbsp;
                                                                        {
                                                                            c.myMetaPath
                                                                        }
                                                                    </div>
                                                                </td>
                                                            );
                                                        } else {
                                                            return <td />;
                                                        }
                                                    })()}
                                                </tr>
                                            );
                                        }
                                    })}
                                </tbody>
                            </table>
                        </div>
                    </PageLayoutRight>
                </PageLayout>
            </Modal>
        );
    }
}
export default connect(
    state => ({
        selectCard: state.zoneSettingData.selectCard
    }),
    {}
)(RelateMetaModal);
