import React, { Component } from 'react';
import _ from 'lodash';
import Ajax from 'Pub/js/ajax';
import { connect } from 'react-redux';
import { Tree, Modal, Button, Checkbox, Select } from 'antd';
import * as utilService from './utilService';
import { opersignNameObj } from './utilService';
const TreeNode = Tree.TreeNode;
const Option = Select.Option;
import { langCheck } from 'Pub/js/utils';
//添加元数据模态框组件
class TreeModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkedKeys: [],
            selectedKeys: [],
            selectedNodes: [],
            searchValue: '',
            needToBeAllSelectNodeList: []
        };
    }
    //设置模态框隐藏
    showModalHidden = () => {
        this.setModalVisible(false);
    };
    //设置模态框隐藏，并归零元数据树的数据
    setModalVisible = modalVisible => {
        this.setState({
            selectedKeys: [],
            checkedKeys: [],
            selectedNodes: [],
            checkedNodes: [],
            needToBeAllSelectNodeList: []
        });
        this.props.setModalVisible(modalVisible);
    };
    //移动到的弹出框中，点击确认
    onOkMoveDialog = () => {
        const modalVisible = false;
        const { selectedNodes } = this.state;
        const { targetAreaID, json } = this.props;
        let cardList = [];
        //循环遍历已经选择的节点，进行查询区/非查询区的数据初始化
        _.forEach(selectedNodes, (s, i) => {
            const {
                myUniqID,
                datatype,
                refname,
                refcode,
                pid,
                refpk,
                isLeaf,
                modelname,
                length,
                notSearchAreaCode,
                proid,
                resid,
                readonly
            } = s.props.dataRef;
            let cardObj = {};
            //查询区
            if (this.props.targetAreaType === '0') {
                //操作符编码
                const opersign = utilService.getObjNameByDatatype(
                    datatype,
                    utilService.opersignObj
                );
                //操作符名称
                const opersignname = utilService.getObjNameByDatatype(
                    datatype,
                    opersignNameObj()
                );
                cardObj = {
                    pk_query_property: `newMetaData_${myUniqID}`,
                    areaid: targetAreaID,
                    datatype: datatype,
                    code: myUniqID,
                    label: refname,
                    metapath: myUniqID,
                    isnotmeta: false,
                    isuse: true,
                    opersign: opersign ? opersign : '=@>@>=@<@<=@like@',
                    opersignname: opersignname
                        ? opersignname
                        : langCheck('ZoneSetting-000001', 'pages', json),/* 国际化处理： 等于@大于@大于等于@小于@小于等于@相似@*/
                    defaultvalue: '',
                    isfixedcondition: false,
                    required: false,
                    disabled: false,
                    visible: datatype === '56' ? false : true,
                    ismultiselectedenabled: false,
                    isquerycondition: true,
                    refname: datatype === '204' ? modelname : '-99',
                    containlower: isLeaf ? false : true,
                    ischeck: false,
                    isbeyondorg: false,
                    usefunc: datatype === '34' ? true : false,
                    showtype: '1',
                    returntype: 'refpk',
                    define1: '',
                    define2: '',
                    define3: '',
                    define4: '',
                    define5: '',
                    itemtype: 'input',
                    myrefpk: refpk,
                    visibleposition: '',
                    tablecode: '',
                    querytablename: '',
                    maxlength: length//查询区新增元数据赋值
                };
            } else {
                //非查询区
                cardObj = {
                    pk_query_property: `newMetaData_${myUniqID}`,
                    areaid: targetAreaID,
                    code: notSearchAreaCode ? notSearchAreaCode : myUniqID,
                    datatype: datatype,
                    label: refname,
                    metapath: myUniqID,
                    color: '#111111',
                    isrevise: false,
                    required: false,
                    disabled: false,
                    visible: datatype === '56' ? false : true,
                    maxlength: length,
                    defaultvalue: '',
                    hyperlinkflag: false,//超链接
                    defaultvar: '',
                    define1: '',
                    define2: '',
                    define3: '',
                    itemtype: 'input',
                    myrefpk: refpk
                };
            }
            if (this.props.targetAreaType === '1') {
                //表单
                cardObj.colnum = '1';
                cardObj.isnextrow = false;
            }
            if (this.props.targetAreaType === '2') {
                //表格
                cardObj.width = '';
                cardObj.istotal = false;
            }
            //参照
            if (cardObj.datatype === '204') {
                cardObj.metaid = refpk;
                cardObj.iscode = false;
                cardObj.modelname = modelname;
            }
            //自定义项
            if (cardObj.datatype === '56') {
                cardObj.isdefined = true;
            }
            //小数或者金额
            if (cardObj.datatype === '31' || cardObj.datatype === '52') {
                cardObj.dataval = '2,,';
            }
            //组件类型
            cardObj.itemtype = utilService.getItemtypeByDatatype(
                cardObj.datatype
            );
            //查询区的若干逻辑组件，默认值设为false
            // if (this.props.targetAreaType === "0" && _.includes(utilService.shouldSetDefaultValueList, cardObj.itemtype)) {
            //     cardObj.defaultvalue='false'
            // }
            //新增了两个属性
            cardObj.proid = proid;
            cardObj.resid = resid;
            if (readonly === true) {
                cardObj.disabled = true;
            }
            cardList.push(cardObj);
        });
        //查询区&非查询区枚举类型需要添加默认dataval
        let ajaxDataForSelect = [];
        _.forEach(cardList, c => {
            if (c.datatype === '203') {
                console.log(c.label);
                ajaxDataForSelect.push(c.myrefpk);
            }
        });
        //若存在枚举类型，
        if (ajaxDataForSelect.length > 0) {
            Ajax({
                url: `/nccloud/platform/templet/getEnumValue.do`,
                info: {
                    name: langCheck('ZoneSetting-000017', 'pages', json),/* 国际化处理： 单据模板设置*/
                    action: langCheck('ZoneSetting-000122', 'pages', json)/* 国际化处理： 下拉选项*/
                },
                data: ajaxDataForSelect,
                success: res => {
                    if (res) {
                        let { data, success } = res.data;
                        if (success && data) {
                            _.forEach(data, d => {
                                _.forEach(cardList, c => {
                                    _.forEach(d, d2 => {
                                        if (d2.id === c.myrefpk) {
                                            if (_.isEmpty(c.dataval)) {
                                                c.dataval = `${d2.name}=${
                                                    d2.value
                                                }`;
                                            } else {
                                                c.dataval = `${c.dataval},${
                                                    d2.name
                                                }=${d2.value}`;
                                            }
                                        }
                                    });
                                });
                            });
                        }
                        this.setDatavalForCard(cardList, modalVisible);
                    }
                }
            });
        } else {
            this.setDatavalForCard(cardList, modalVisible);
        }
    };
    //非查询区的参照类型需要添加默认dataval
    setDatavalForCard = (cardList, modalVisible) => {
        let { json } = this.props;
        if (this.props.targetAreaType !== '0') {
            let ajaxData = [];
            _.forEach(cardList, c => {
                if (c.datatype === '204') {
                    ajaxData.push(c.modelname);
                }
            });
            if (ajaxData.length > 0) {
                Ajax({
                    url: `/nccloud/platform/templet/getRefDefaultSel.do`,
                    info: {
                        name: langCheck('ZoneSetting-000017', 'pages', json),/* 国际化处理： 单据模板设置*/
                        action: langCheck('ZoneSetting-000024', 'pages', json)/* 国际化处理： 查询参照默认下拉选项*/
                    },
                    data: ajaxData,
                    success: res => {
                        if (res) {
                            let { data, success } = res.data;
                            if (success && data) {
                                _.forEach(data, d => {
                                    _.forEach(cardList, c => {
                                        if (d.name === c.modelname) {
                                            c.dataval = `${
                                                d.pk_refinfo
                                            },code=N`;
                                            c.refname = d.name;
                                            c.refcode = d.refpath;
                                        }
                                    });
                                });
                            }
                            this.props.addCard(cardList);
                            this.setModalVisible(modalVisible);
                        }
                    }
                });
            } else {
                this.props.addCard(cardList);
                this.setModalVisible(modalVisible);
            }
        } else {
            this.props.addCard(cardList);
            this.setModalVisible(modalVisible);
        }
    };
    //关于树的方法
    //选中事件，设置selectKeys和SelectNodes
    onSelect = (selectedKeys, info) => {
        // this.setState({ selectedKeys, selectedNodes: info.selectedNodes });
        this.setState({
            checkedKeys: selectedKeys,
            selectedKeys: selectedKeys,
            selectedNodes: info.selectedNodes,
            checkedNodes: info.selectedNodes
        });
    };
    //复选框选中事件，设置checkedKeys
    onCheck = (checkedKeys, info) => {
        // this.setState({
        //     checkedKeys,
        //     checkedNodes: info.checkedNodes
        // });
        this.setState({
            selectedKeys: checkedKeys.checked,
            checkedKeys: checkedKeys.checked,
            checkedNodes: info.checkedNodes,
            selectedNodes: info.checkedNodes//关联checkedbox和文本选中数据
        });
    };
    //递归调用，渲染树节点
    renderTreeNodes = data => {
        return data.map(item => {
            if (item.children) {
                return (
                    <TreeNode
                        title={item.title}
                        switcherIcon={({ expanded }) => {
                            return (
                                <i
                                    className={`font-size-18 iconfont ${
                                        expanded
                                            ? 'icon-shu_zk'
                                            : 'icon-shushouqi'
                                    }`}
                                />
                            );
                        }}
                        key={item.key}
                        dataRef={item}
                    >
                        {this.renderTreeNodes(item.children)}
                    </TreeNode>
                );
            }
            if(item.isleaf){
                return (
                    <TreeNode
                        {...item}
                        dataRef={item}
                    />
                );
            }else{
                return (
                    <TreeNode
                    switcherIcon={({ expanded }) => {
                        return (
                            <i
                                className={`font-size-18 iconfont ${
                                    expanded
                                        ? 'icon-shu_zk'
                                        : 'icon-shushouqi'
                                }`}
                            />
                        );
                    }}
                    {...item}
                    dataRef={item}
                />
                );
            }
           
        });
    };
    //异步树，点击展开，发送ajax请求
    onLoadData = treeNode => {
        let { json } = this.props;
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
                                let tmpMetaTree = {
                                    ...r,
                                    title: `${r.refcode} ${r.refname}`,
                                    key: `${treeNode.props.myUniqID}.${
                                        r.refcode
                                    }`,
                                    myUniqID: `${treeNode.props.myUniqID}.${
                                        r.refcode
                                    }`,
                                    isLeaf: r.isleaf
                                };
                                //非查询区域的子表里的code不是全路径
                                if (
                                    this.props.targetAreaType !== '0' &&
                                    treeNode.props.notSearchAreaCode
                                ) {
                                    tmpMetaTree.notSearchAreaCode = `${
                                        treeNode.props.notSearchAreaCode
                                    }.${r.refcode}`;
                                }
                                //非查询区域的子表的code，若父级是205则直接为自身refcode
                                if (
                                    this.props.targetAreaType !== '0' &&
                                    treeNode.props.datatype === '205'
                                ) {
                                    tmpMetaTree.notSearchAreaCode = `${
                                        r.refcode
                                    }`;
                                }
                                metaTree.push(tmpMetaTree);
                            });
                            treeNode.props.dataRef.children = [].concat(
                                metaTree
                            );
                            this.props.updateMetaTreeData([
                                ...this.props.metaTree
                            ]);
                            resolve();
                        }
                    }
                }
            });
        });
    };
    getContentDom = () => {
        const { metaTree } = this.props;
        return (
            <div className="template-setting-left-sider template-setting-sider">
                <div className="sider-content">
                    <div className="sider-search">
                        {/* <Input
							placeholder='请搜索元数据名称'
							style={{ width: '70%' }}
							onPressEnter={this.onInputSearch}
							onChange={this.onInputChange}
							addonAfter={
								<Icon type='search' className='search-input-icon' onClick={this.onInputSearch} />
							}
						/> */}
                    </div>

                    <div className="sider-tree">
                        <Tree
                            checkable
                            checkStrictly={true}
                            loadData={this.onLoadData}
                            showLine={true}
                            multiple={true}
                            onSelect={this.onSelect}
                            selectedKeys={this.state.selectedKeys}
                            checkedKeys={this.state.checkedKeys}
                            onCheck={this.onCheck}
                        >
                            {this.renderTreeNodes(metaTree)}
                        </Tree>
                    </div>
                </div>
            </div>
        );
    };
    //选择/取消选择所有的节点，且205数据类型不选中
    selectAllTreeNode = (isChecked, metaTreeNodeList) => {
        let { selectedKeys, checkedKeys } = this.state;
        selectedKeys = _.cloneDeep(selectedKeys);
        if (isChecked) {
            //循环遍历树结构，只选中非205的数据类型
            //循环遍历树结构，只选中非205的数据类型
            _.forEach(metaTreeNodeList, (m, i) => {
                if (
                    selectedKeys.indexOf(m.myUniqID) === -1 &&
                    m.datatype !== '205'
                ) {
                    selectedKeys.push(m.myUniqID);
                    this.state.selectedNodes.push({
                        props: {
                            dataRef: {
                                ...m
                            }
                        }
                    });
                }
            });
        } else {
            _.forEach(metaTreeNodeList, (m, i) => {
                _.remove(selectedKeys, n => {
                    return n === m.myUniqID;
                });
            });
            _.forEach(metaTreeNodeList, (m, i) => {
                _.remove(this.state.selectedNodes, n => {
                    return n.props.dataRef.myUniqID === m.myUniqID;
                });
            });
        }
        this.setState({
            selectedKeys,
            checkedKeys: selectedKeys
        });
    };
    //下拉选择205类型的节点
    handleChangeSelectTreeNode = value => {
        const { metaTree, canSelectTreeNodeList } = this.props;
        //循环遍历204类型的节点
        _.forEach(canSelectTreeNodeList, m => {
            if (value.indexOf(`${m.refcode} ${m.refname}`) === -1) {
                if (m.children !== null) {
                    setTimeout(() => {
                        this.selectAllTreeNode(false, m.children);
                    }, 0);
                }
            } else {
                if (m.children !== null) {
                    setTimeout(() => {
                        this.selectAllTreeNode(true, m.children);
                    }, 0);
                }
            }
        });

        this.setState({ needToBeAllSelectNodeList: value });
    };
    //模态框的标题部分
    getModalTitleDom = () => {
        let { json } = this.props;
        return (
            <div>
                <span>{langCheck('ZoneSetting-000124', 'pages', json)}</span>
                {/* /* 国际化处理： 添加元数据*/ }
                <Checkbox
                    style={{ marginLeft: '25px' }}
                    onChange={e => {
                        this.selectAllTreeNode(
                            e.target.checked,
                            this.props.metaTree
                        );
                    }}
                >
                    {langCheck('ZoneSetting-000125', 'pages', json)}
                    {/* /* 国际化处理： 全选根节点*/ }
                </Checkbox>
                {(() => {
                    if (this.props.canSelectTreeNodeList.length > 0) {
                        return (
                            <Select
                                maxTagCount={1}
                                size="small"
                                style={{ width: '50%' }}
                                mode="multiple"
                                placeholder={langCheck('ZoneSetting-000126', 'pages', json)}/* 国际化处理： 请先展开对应树节点，再选择*/
                                onChange={this.handleChangeSelectTreeNode}
                                value={this.state.needToBeAllSelectNodeList}
                            >
                                {this.props.canSelectTreeNodeList.map(
                                    (node, index) => {
                                        return (
                                            <Option
                                                key={`${node.refcode} ${
                                                    node.refname
                                                }`}
                                                disabled={
                                                    node.children ? false : true
                                                }
                                            >
                                                {node.refcode} {node.refname}
                                            </Option>
                                        );
                                    }
                                )}
                            </Select>
                        );
                    }
                })()}
            </div>
        );
    };
    render() {
        let { json } = this.props;
        return (
            <Modal
                maskClosable={false}
                title={this.getModalTitleDom()}
                mask={false}
                wrapClassName="vertical-center-modal"
                visible={this.props.modalVisible}
                onOk={this.onOkMoveDialog}
                onCancel={this.showModalHidden}
                destroyOnClose={true}
                width={'50%'}
                style={{ top: 20 }}
                // bodyStyle={{width: 640, height:'100%',overflowY:'auto'}}
                footer={[
                    <Button
                        key="submit"
                        // disabled={this.state.selectedKeys.length === 0}
                        type="primary"
                        onClick={this.onOkMoveDialog}
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
                {this.getContentDom()}
            </Modal>
        );
    }
}
export default connect(
    state => ({}),
    {}
)(TreeModal);
