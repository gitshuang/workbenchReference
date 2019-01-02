import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import {
    setTreeData,
    setTreeTemBillData,
    setTreeTemPrintData,
    setExpandedKeys,
    setSelectedKeys,
    setDef1,
    setSelectedTemKeys,
    setExpandedTemKeys,
    setTemplatePk,
    setSearchValue,
    setPageCode,
    setAppCode,
    setParentIdcon,
    setTemplateNameVal,
    setTemplateTitleVal,
    setOrgidObj,
    setNodeKey,
    setCopyId,
    setJson,
    setTemplateType
} from 'Store/TemplateSetting-unit/action';
import { Modal, Tree, Input } from 'antd';
import { PageLayout, PageLayoutHeader, PageLayoutLeft, PageLayoutRight } from 'Components/PageLayout';
import { createTree } from 'Pub/js/createTree';
import Ajax from 'Pub/js/ajax.js';
import Notice from 'Components/Notice';
import { ControlTip } from 'Components/ControlTip';
import ButtonCreate from 'Components/ButtonCreate';
import BusinessUnitTreeRefUnit from 'Components/Refers/BusinessUnitTreeRefUnit';
import PreviewModal from './showPreview';
import AssignComponent from './assignComponent';
import CopyMoudle from './copyMoudle';
import { openPage } from 'Pub/js/superJump';
import Svg from 'Components/Svg';
import { generateTemData, generateTreeData } from './method';
import { getMulti } from 'Pub/js/getMulti';
import { langCheck } from 'Pub/js/utils';
import './index.less';
const TreeNode = Tree.TreeNode;
const Search = Input.Search;

class TemplateSettingUnit extends Component {
    constructor(props) {
        super(props);
        this.state = {
            treeData: [],
            autoExpandParent: true,
            autoExpandTemParent: true,
            treeTemBillData: [], //单据模板数据
            treeTemPrintData: [],
            treePrintTemData: [],
            visible: false,
            alloVisible: false,
            previewPrintVisible: false,
            previewPrintContent: '',
            batchSettingModalVisibel: false
        };
    }
    //取消
    setCopyVisible = (visible) => {
        this.setState({
            visible: visible
        });
    };
    //按钮事件的触发
    handleClick = (code) => {
        const { def1, templatePk, appCode, orgidObj, json, pageCode } = this.props;
        let infoData = {
            templateId: templatePk
        };
        if (!orgidObj.refpk) {
            Notice({ status: 'warning', msg: langCheck('10181TM-000030', "pages", json) }); /* 国际化处理： 请选中业务单元*/
            return;
        }
        if (!templatePk) {
            Notice({ status: 'warning', msg: langCheck('10181TM-000031', "pages", json) }); /* 国际化处理： 请选择模板数据*/
            return;
        }
        switch (code) {
            case 'copy':
                this.setState({
                    visible: true
                });
                break;
            case 'edit':
                if (def1 === 'menuitem') {
                    Ajax({
                        loading: true,
                        url: '/nccloud/platform/template/edittemplate.do',
                        data: { appcode: appCode, templateid: templatePk },
                        success: function(res) {
                            if (location.port) {
                                window.open(
                                    'uclient://start/' +
                                        'http://' +
                                        location.hostname +
                                        ':' +
                                        location.port +
                                        res.data.data
                                );
                            } else {
                                window.open('uclient://start/' + 'http://' + location.hostname + res.data.data);
                            }
                        },
                        error: function(res) {
                            alert('lm:' + res.message);
                        }
                    });
                } else {
                    openPage(`ZoneSetting`, false, {
                        templetid: templatePk,
                        status: 'templateSetting-unit',
                        appcode: appCode,//绪鹏添加（实施态需要传参清除模板缓存）
                        pcode: pageCode
                    });
                }
                break;
            case 'delete':
                let url;
                if (def1 === 'menuitem') {
                    url = `/nccloud/platform/template/deletePrintTemplate.do`;
                } else {
                    url = `/nccloud/platform/template/deleteTemplateDetail.do`;
                }
                ControlTip({
                    status: 'warning',
                    title: langCheck('10181TM-000038', "pages", json) /* 国际化处理： 删除*/,
                    msg: langCheck('10181TM-000039', "pages", json) /* 国际化处理： 你确认要删除吗？,你确认要删除吗*/,
                    onOk: () => {
                        Ajax({
                            url: url,
                            data: infoData,
                            info: {
                                name: langCheck('10181TM-000009', "pages", json) /* 国际化处理： 模板设置*/,
                                action: langCheck('10181TM-000038', "pages", json) /* 国际化处理： 删除*/
                            },
                            success: ({ data }) => {
                                if (data.success) {
                                    Notice({
                                        status: 'success',
                                        msg: langCheck('10181TM-000040', "pages", json) /* 国际化处理： 删除成功*/
                                    });
                                    this.reqTreeTemData();
                                }
                            }
                        });
                    }
                });
                break;
            case 'assign':
                this.setState({
                    alloVisible: true
                });
                break;
            case 'browse':
                if (def1 === 'menuitem') {
                    this.showModal();
                } else {
                    this.setState({
                        batchSettingModalVisibel: true
                    });
                }
                break;
            default:
                break;
        }
    };
    componentWillMount = () => {
        let callback = (json) => {
            this.props.setJson(json);
        };
        getMulti({
            moduleId: '10181TM',
            domainName: 'workbench',
            callback
        });
    };
    componentDidMount = () => {
        let {
            selectedKeys,
            setSelectedKeys,
            def1,
            expandedKeys,
            setExpandedKeys,
            appCode,
            pageCode,
            setAppCode,
            setPageCode,
            expandedTemKeys,
            setExpandedTemKeys,
            selectedTemKeys,
            setSelectedTemKeys,
            searchValue
        } = this.props;
        if (def1 !== '') {
            if (searchValue) {
                this.handleSearch(searchValue, this.handleExpanded);
            } else {
                this.reqTreeData();
            }
            setSelectedKeys(selectedKeys);
            setDef1(def1);
            setExpandedKeys(expandedKeys);
            setAppCode(appCode);
            setPageCode(pageCode);
            this.reqTreeTemData('historyData');
            setExpandedTemKeys(expandedTemKeys);
            setSelectedTemKeys(selectedTemKeys);
        } else {
            this.reqTreeData(this.setInformationFun);
        }
    };
    //保持选中数据信息一致
    setInformationFun = (treeData) => {
        let { setSelectedKeys, setDef1, setAppCode, setPageCode } = this.props;
        if (treeData && treeData.length > 0) {
            setSelectedKeys([ treeData[0].pk ]);
            setDef1(treeData[0].def1);
            setAppCode(treeData[0].appCode);
            if (treeData[0].pageCode) {
                setPageCode(treeData[0].pageCode);
            }
        }
    };
    //右侧树组装数据
    restoreTreeTemData = (templateType, eventType) => {
        let { treeTemBillData, treeTemPrintData } = this.state;
        let {
            def1,
            copyId,
            expandedTemKeys,
            setExpandedTemKeys,
            setSelectedTemKeys,
            setParentIdcon,
            setTemplatePk,
            setTemplateNameVal,
            setTemplateTitleVal,
            json
        } = this.props;
        let treeTemBillDataArray = this.props.treeTemBillData;
        let treeTemPrintDataArray = this.props.treeTemPrintData;
        let treeData = [];
        let treeInfo;
        if (templateType === 'bill') {
            treeTemBillDataArray.map((item) => {
                if (item.isDefault === 'y') {
                    item.name = item.name + langCheck('10181TM-000041', "pages", json); /* 国际化处理：  [默认],默认*/
                }
            });
            treeInfo = generateTemData(treeTemBillDataArray);
        } else if (templateType === 'print') {
            treeTemPrintDataArray.map((item) => {
                if (item.isDefault === 'y') {
                    item.name = item.name + langCheck('10181TM-000041', "pages", json); /* 国际化处理：  [默认],默认*/
                }
            });
            treeInfo = generateTemData(treeTemPrintDataArray);
        }
        let { treeArray, treeObj } = treeInfo;
        treeArray.map((item, index) => {
            const groupObj = {
                name: langCheck('10181TM-000042', "pages", json) /* 国际化处理： 集团模板*/,
                title: langCheck('10181TM-000042', "pages", json) /* 国际化处理： 集团模板*/,
                pk: 'qazwsxedc1' + item.pk,
                code: '1001',
                parentId: 'groupRoot',
                children: []
            };
            const orgIdObj = {
                title: langCheck('10181TM-000043', "pages", json) /* 国际化处理： 组织模板*/,
                name: langCheck('10181TM-000043', "pages", json) /* 国际化处理： 组织模板*/,
                pk: 'qazwsxedc2' + item.pk,
                code: '1002',
                parentId: 'groupRoot',
                children: []
            };
            item.children.push(groupObj);
            item.children.push(orgIdObj);
            for (const key in treeObj) {
                if (treeObj.hasOwnProperty(key)) {
                    if (item.templateId === treeObj[key][0].parentId) {
                        if (treeObj[key][0].type === 'group') {
                            item.children[0].children.push(treeObj[key][0]);
                        } else if (treeObj[key][0].type === 'org') {
                            item.children[1].children.push(treeObj[key][0]);
                        }
                    }
                }
            }
        });
        //处理树数据
        treeData = treeInfo.treeArray;
        treeData = generateTreeData(treeData);
        if (templateType === 'bill') {
            if (def1 === 'apppage') {
                if (treeData.length > 0) {
                    if (!eventType) {
                        let newinitKeyArray = [];
                        newinitKeyArray.push(treeData[0].key);
                        setSelectedTemKeys(newinitKeyArray);
                        setParentIdcon(treeData[0].parentId);
                        setTemplatePk(treeData[0].pk);
                        setTemplateNameVal(treeData[0].name);
                    } else if (eventType && eventType === 'copy') {
                        treeData.map((item) => {
                            if (item.children && item.children.length > 0) {
                                item.children.map((ele) => {
                                    if (ele.children && ele.children.length > 0) {
                                        ele.children.map((e) => {
                                            if (copyId === e.key) {
                                                if (e.type === 'group') {
                                                    let cc = 'qazwsxedc1' + e.parentId;
                                                    let array = [ ...expandedTemKeys, e.parentId, cc ];
                                                    setExpandedTemKeys(array);
                                                } else if (e.type === 'org') {
                                                    let cc = 'qazwsxedc2' + e.parentId;
                                                    let array = [ ...expandedTemKeys, e.parentId, cc ];
                                                    setExpandedTemKeys(array);
                                                }
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                } else {
                    this.props.setParentIdcon('');
                }
            }
            treeTemBillData = treeData;
            this.setState({
                treeTemBillData
            });
        } else if (templateType === 'print') {
            if (def1 === 'menuitem') {
                if (treeData.length > 0) {
                    if (!eventType) {
                        let newinitKeyArray = [];
                        newinitKeyArray.push(treeData[0].key);
                        setSelectedTemKeys(newinitKeyArray);
                        setParentIdcon(treeData[0].parentId);
                        setTemplatePk(treeData[0].pk);
                        setTemplateNameVal(treeData[0].name);
                        setTemplateTitleVal(treeData[0].code);
                    } else if (eventType && eventType === 'copy') {
                        treeData.map((item) => {
                            if (item.children && item.children.length > 0) {
                                item.children.map((ele) => {
                                    if (ele.children && ele.children.length > 0) {
                                        ele.children.map((e) => {
                                            if (copyId === e.key) {
                                                if (e.type === 'group') {
                                                    let cc = 'qazwsxedc1' + e.parentId;
                                                    let array = [ ...expandedTemKeys, e.parentId, cc ];
                                                    setExpandedTemKeys(array);
                                                } else if (e.type === 'org') {
                                                    let cc = 'qazwsxedc2' + e.parentId;
                                                    let array = [ ...expandedTemKeys, e.parentId, cc ];
                                                    setExpandedTemKeys(array);
                                                }
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                } else {
                    this.props.setParentIdcon('');
                }
            }
            treeTemPrintData = treeData;
            this.setState({
                treeTemPrintData
            });
        }
    };
    onExpand = (typeSelect, expandedKeys) => {
        switch (typeSelect) {
            case 'systemOnselect':
                this.props.setExpandedKeys(expandedKeys);
                this.setState({
                    autoExpandParent: false
                });
                break;
            case 'templateOnselect':
                this.props.setExpandedTemKeys(expandedKeys);
                this.setState({
                    autoExpandTemParent: false
                });
                break;
            default:
                break;
        }
    };
    //加载右侧模板数据
    onSelectQuery = (key, e) => {
        const { orgidObj, selectedKeys, json } = this.props;
        if (!orgidObj.refpk) {
            Notice({ status: 'warning', msg: langCheck('10181TM-000030', "pages", json) }); /* 国际化处理： 请选中业务单元*/
            return;
        }
        if (key.length > 0) {
            this.props.setSelectedKeys(key);
            this.props.setDef1(e.selectedNodes[0].props.refData.def1);
            this.props.setAppCode(e.selectedNodes[0].props.refData.appCode);
            this.props.setPageCode(e.selectedNodes[0].props.refData.code);
            this.setState(
                {
                    autoExpandParent: true
                },
                this.reqTreeTemData
            );
        } else {
            if (selectedKeys) {
                this.reqTreeTemData();
            }
        }
    };
    //请求右侧树数据
    reqTreeTemData = (eventType) => {
        const { pageCode, appCode, def1, orgidObj } = this.props;
        let infoData = {
            pageCode: pageCode,
            appCode: appCode,
            orgId: orgidObj.refpk
        };
        if (!infoData.pageCode) {
            return;
        }
        if (def1 === 'apppage') {
            infoData.templateType = 'bill';
            this.reqTreeTemAjax(infoData, 'bill', eventType);
        } else if (def1 === 'menuitem') {
            if (infoData.pageCode) {
                delete infoData.pageCode;
            }
            infoData.templateType = 'print';
            this.reqTreeTemAjax(infoData, 'print', eventType);
        }
    };
    //请求右侧树数据ajax方法封装
    reqTreeTemAjax = (infoData, templateType, eventType) => {
        let { json } = this.props;
        Ajax({
            url: `/nccloud/platform/template/getTemplatesOfPage.do`,
            data: infoData,
            info: {
                name: langCheck('10181TM-000009', "pages", json) /* 国际化处理： 模板设置*/,
                action: langCheck('10181TM-000044', "pages", json) /* 国际化处理： 参数查询*/
            },
            success: ({ data }) => {
                if (data.success) {
                    if (templateType === 'bill') {
                        this.props.setTreeTemBillData(data.data);
                        this.restoreTreeTemData(templateType, eventType);
                    } else if (templateType === 'print') {
                        this.props.setTreeTemPrintData(data.data);
                        this.restoreTreeTemData(templateType, eventType);
                    }
                }
            }
        });
    };
    //单据模板树的onSelect事件
    onTemSelect = (key, e) => {
        const { def1 } = this.props;
        if (def1 === 'apppage') {
        } else if (def1 === 'menuitem') {
            if (key.length > 0) {
                this.props.setNodeKey(e.selectedNodes[0].props.refData.nodeKey);
            }
        }
        if (key.length > 0) {
            this.props.setSelectedTemKeys(key);
            this.props.setTemplatePk(e.selectedNodes[0].props.refData.templateId);
            this.props.setParentIdcon(e.selectedNodes[0].props.refData.parentId);
            this.props.setTemplateNameVal(e.selectedNodes[0].props.refData.name);
            this.props.setTemplateTitleVal(e.selectedNodes[0].props.refData.code);
            this.props.setTemplateType(e.selectedNodes[0].props.refData.type);
        }
    };
    /**
     * tree 数据请求
     */
    reqTreeData = (callBack) => {
        let { json } = this.props;
        Ajax({
            url: `/nccloud/platform/appregister/querymenuitemstree.do`,
            info: {
                name: langCheck('10181TM-000002', "pages", json) /* 国际化处理： 应用注册模块*/,
                action: langCheck('10181TM-000045', "pages", json) /* 国际化处理： 查询*/
            },
            success: ({ data }) => {
                if (data.success && data.data.length > 0) {
                    this.props.setTreeData(data.data);
                    if (callBack && typeof callBack === 'function') {
                        callBack(data.data);
                    }
                }
            }
        });
    };
    //树点击事件的汇总
    onSelect = (typeSelect, key, e) => {
        switch (typeSelect) {
            case 'systemOnselect':
                this.onSelectQuery(key, e);
                break;
            case 'templateOnselect':
                this.onTemSelect(key, e);
                break;
            default:
                break;
        }
    };
    //tree的查询方法
    onChange = (e) => {
        const value = e.target.value;
        if (value) {
            this.props.setSearchValue(value);
            this.handleSearch(value, this.handleExpanded);
        } else {
            this.reqTreeData(this.setInformationFun);
            const expandedKeys = [ '00' ];
            this.props.setExpandedKeys(expandedKeys);
            this.props.setSearchValue('');
        }
    };
    handleExpanded = (dataList) => {
        const expandedKeys = dataList.map((item, index) => {
            return item.pk;
        });
        expandedKeys.push('00');
        this.props.setExpandedKeys(expandedKeys);
        this.setState({
            autoExpandParent: true
        });
    };
    handleSearch = (value, callback) => {
        let { json } = this.props;
        Ajax({
            url: `/nccloud/platform/appregister/searchappmenuitem.do`,
            data: {
                search_content: value,
                containAppPage: true
            },
            info: {
                name: langCheck('10181TM-000046', "pages", json) /* 国际化处理： 菜单项*/,
                action: langCheck('10181TM-000047', "pages", json) /* 国际化处理： 查询应用树*/
            },
            success: (res) => {
                let { success, data } = res.data;
                if (success && data) {
                    this.props.setTreeData(data);
                    callback(data);
                }
            }
        });
    };
    //树的双击事件回调方法
    hanldeDoubleClick = (typeSelect, e, node) => {
        let nodeDataoMduleid;
        let expandedKeys = [];
        switch (typeSelect) {
            case 'systemOnselect':
                nodeDataoMduleid = node.props.refData.pk;
                expandedKeys = this.props.expandedKeys.concat([ nodeDataoMduleid ]);
                this.props.setExpandedKeys(expandedKeys);
                break;
            case 'templateOnselect':
                nodeDataoMduleid = node.props.refData.pk;
                let expandedTemKeys = this.props.expandedTemKeys.concat([ nodeDataoMduleid ]);
                this.props.setExpandedTemKeys(expandedTemKeys);
                break;
            default:
                break;
        }
    };
    /**
     * 查询框删除按钮
     */
    handleSearchDel = () => {
        this.reqTreeData(this.setInformationFun);
        const expandedKeys = [ '00' ];
        this.props.setExpandedKeys(expandedKeys);
        this.props.setSearchValue('');
    };
    //树组件的封装
    treeResAndUser = (data, typeSelect, hideSearch, selectedKeys, expandedKeys, autoExpandParent, typeClass) => {
        const { searchValue, json } = this.props;
        const loop = (data) => {
            return data.map((item) => {
                let { code, name, pk } = item;
                let text = `${code} ${name}`;
                if (code === '00') {
                    text = `${name}`;
                }
                const index = text.indexOf(searchValue);
                const beforeStr = text.substr(0, index);
                const afterStr = text.substr(index + searchValue.length);
                const title =
                    index > -1 ? (
                        <span>
                            {beforeStr}
                            <span style={{ color: '#f50' }}>{searchValue}</span>
                            {afterStr}
                        </span>
                    ) : (
                        <span>
                            <span> {text} </span>
                        </span>
                    );
                if (item.children && item.children.length > 0) {
                    return (
                        <TreeNode
                            key={pk}
                            title={title}
                            refData={item}
                            icon={({ expanded }) => {
                                return (
                                    <Svg
                                        width={20}
                                        height={20}
                                        xlinkHref={expanded ? '#icon-wenjianjiadakai' : '#icon-wenjianjia'}
                                    />
                                );
                            }}
                            switcherIcon={({ expanded }) => {
                                return (
                                    <i
                                        className={`font-size-18 iconfont ${expanded
                                            ? 'icon-shu_zk'
                                            : 'icon-shushouqi'}`}
                                    />
                                );
                            }}
                        >
                            {loop(item.children)}
                        </TreeNode>
                    );
                }
                return <TreeNode icon={<span className='tree-dot' />} key={pk} title={title} refData={item} />;
            });
        };
        return (
            <div className={typeClass ? typeClass : ''}>
                {hideSearch ? (
                    ''
                ) : (
                    <div className='fixed-search-input'>
                        <Search
                            placeholder={langCheck('10181TM-000048', "pages", json)} /* 国际化处理： 菜单查询*/
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
                )}
                {data.length > 0 && (
                    <Tree
                        showLine
                        showIcon
                        onExpand={(key, node) => {
                            this.onExpand(typeSelect, key);
                        }}
                        expandedKeys={expandedKeys}
                        onSelect={(key, node) => {
                            this.onSelect(typeSelect, key, node);
                        }}
                        autoExpandParent={autoExpandParent}
                        selectedKeys={selectedKeys}
                        onDoubleClick={(key, node) => {
                            this.hanldeDoubleClick(typeSelect, key, node);
                        }}
                    >
                        {loop(data)}
                    </Tree>
                )}
            </div>
        );
    };
    //预览摸态框显示方法
    setModalVisibel = (visibel) => {
        this.setState({ batchSettingModalVisibel: visibel });
    };
    //分配摸态框显示方法
    setAssignModalVisible = (visibel) => {
        this.setState({ alloVisible: visibel });
    };
    //参照的回调函数
    handdleRefChange = (value) => {
        let { refname, refcode, refpk } = value;
        let orgidObj = {};
        orgidObj['refname'] = refname;
        orgidObj['refcode'] = refcode;
        orgidObj['refpk'] = refpk;
        this.props.setOrgidObj(orgidObj);
        if (this.props.orgidObj) {
            this.reqTreeTemData();
        }
    };
    //打印模板预览打开
    showModal = () => {
        this.setState({ previewPrintVisible: true }, () => {
            this.printModalAjax(this.props.templatePk);
        });
    };
    //打印模板预览关闭
    hideModal = () => {
        this.setState({ previewPrintVisible: false });
    };
    //打印模板预览界面请求
    printModalAjax = (templateId) => {
        let { json } = this.props;
        let infoData = {};
        infoData.templateId = templateId;
        const url = `/nccloud/platform/template/previewPrintTemplate.do`;
        Ajax({
            url: url,
            data: infoData,
            info: {
                name: langCheck('10181TM-000009', "pages", json) /* 国际化处理： 模板设置*/,
                action: langCheck('10181TM-000049', "pages", json) /* 国际化处理： 打印模板预览*/
            },
            success: ({ data }) => {
                if (data.success) {
                    document.getElementsByClassName('printContent')[0].innerHTML = data.data;
                }
            }
        });
    };
    render() {
        const {
            treeTemBillData,
            treeTemPrintData,
            visible,
            alloVisible,
            batchSettingModalVisibel,
            autoExpandParent,
            autoExpandTemParent,
            previewPrintVisible
        } = this.state;
        const {
            selectedKeys,
            expandedKeys,
            def1,
            selectedTemKeys,
            expandedTemKeys,
            templatePk,
            orgidObj,
            json,
            parentIdcon,
            templateType
        } = this.props;
        const leftTreeData = [
            {
                code: '00',
                name: langCheck('10181TM-000050', "pages", json) /* 国际化处理： 菜单树*/,
                pk: '00',
                children: createTree(this.props.treeData, 'code', 'pid')
            }
        ];
        const Btns = [
            {
                name: langCheck('10181TM-000051', "pages", json) /* 国际化处理： 修改*/,
                type: '',
                code: 'edit',
                isshow: def1 &&parentIdcon&& (parentIdcon !== 'root' && parentIdcon !== 'groupRoot' && templateType !== 'group')
            },
            {
                name: langCheck('10181TM-000038', "pages", json) /* 国际化处理： 删除*/,
                type: '',
                code: 'delete',
                isshow: def1 &&parentIdcon&& (parentIdcon !== 'root' && parentIdcon !== 'groupRoot' && templateType !== 'group')
            },
            {
                name: langCheck('10181TM-000052', "pages", json) /* 国际化处理： 复制*/,
                type: 'primary',
                code: 'copy',
                isshow: def1 && (parentIdcon !== 'groupRoot' && parentIdcon)
            },
            {
                name: langCheck('10181TM-000053', "pages", json) /* 国际化处理： 分配*/,
                type: '',
                code: 'assign',
                isshow: def1 &&parentIdcon&& (parentIdcon !== 'root' && parentIdcon !== 'groupRoot' && templateType !== 'group')
            },
            {
                name: langCheck('10181TM-000054', "pages", json) /* 国际化处理： 浏览*/,
                type: '',
                code: 'browse',
                isshow: def1 && (parentIdcon !== 'groupRoot' && parentIdcon)
            }
        ];
        return (
            <PageLayout
                className='nc-workbench-templateSetting'
                header={
                    <PageLayoutHeader>
                        <div className='header-title'>
                            <h2 className='header-titleName'>{langCheck('10181TM-000032', "pages", json)}</h2>
                            {/* 国际化处理： 模板设置-业务单元*/}
                            <div style={{ width: '200px' }}>
                                <BusinessUnitTreeRefUnit
                                    value={orgidObj}
                                    placeholder={langCheck('10181TM-000016', "pages", json)} /* 国际化处理： 默认业务单元*/
                                    onChange={(value) => {
                                        this.handdleRefChange(value);
                                    }}
                                />
                            </div>
                        </div>
                        <ButtonCreate dataSource={Btns} onClick={this.handleClick} />
                    </PageLayoutHeader>
                }
            >
                <PageLayoutLeft>
                    {this.treeResAndUser(
                        leftTreeData,
                        'systemOnselect',
                        null,
                        selectedKeys,
                        expandedKeys,
                        autoExpandParent,
                        'templateSetting-searchTree workbench-scroll'
                    )}
                </PageLayoutLeft>
                <PageLayoutRight>
                    {def1 == 'apppage' ? treeTemBillData.length > 0 ? (
                        <div className='templateTree-wrap'>
                            <p className='template-title'>{langCheck('10181TM-000033', "pages", json)}</p>
                            {/* 国际化处理： 页面模板*/}
                            {this.treeResAndUser(
                                treeTemBillData,
                                'templateOnselect',
                                'hideSearch',
                                selectedTemKeys,
                                expandedTemKeys,
                                autoExpandTemParent,
                                'templateTree'
                            )}
                        </div>
                    ) : (
                        <div className='noPageData'>
                            <p className='noDataTip'>{langCheck('10181TM-000034', "pages", json)}</p>
                            {/* 国际化处理： 该页面无页面模板*/}
                        </div>
                    ) : def1 == 'menuitem' ? treeTemPrintData.length > 0 ? (
                        <div className='templateTree-wrap'>
                            <p className='template-title'>{langCheck('10181TM-000035', "pages", json)}</p>
                            {/* 国际化处理： 打印模板*/}
                            {this.treeResAndUser(
                                treeTemPrintData,
                                'templateOnselect',
                                'hideSearch',
                                selectedTemKeys,
                                expandedTemKeys,
                                autoExpandTemParent,
                                'templateTree'
                            )}
                        </div>
                    ) : (
                        <div className='noPrintData'>
                            <p className='noDataTip'>{langCheck('10181TM-000036', "pages", json)}</p>
                            {/* 国际化处理： 该页面无打印模板*/}
                        </div>
                    ) : (
                        <div className='noData'>
                            <p className='noDataTip'>{langCheck('10181TM-000037', "pages", json)}</p>
                            {/* 国际化处理： 请选择应用、页面查看数据*/}
                        </div>
                    )}
                </PageLayoutRight>
                {batchSettingModalVisibel && (
                    <PreviewModal
                        templetid={templatePk}
                        batchSettingModalVisibel={batchSettingModalVisibel}
                        setModalVisibel={this.setModalVisibel}
                        langJson={json}
                    />
                )}
                {visible && (
                    <CopyMoudle
                        visible={visible}
                        reqTreeTemData={this.reqTreeTemData}
                        setCopyVisible={this.setCopyVisible}
                    />
                )}
                {previewPrintVisible && (
                    <Modal
                        title={langCheck('10181TM-000049', "pages", json)} /* 国际化处理： 打印模板预览*/
                        maskClosable={false}
                        visible={previewPrintVisible}
                        onCancel={this.hideModal}
                        footer={null}
                        centered={true}
                        width={'calc(100vw - 64px)'}
                        className='viewPageTem'
                    >
                        <div className='printContent' />
                    </Modal>
                )}
                {alloVisible && (
                    <AssignComponent alloVisible={alloVisible} setAssignModalVisible={this.setAssignModalVisible} />
                )}
            </PageLayout>
        );
    }
}
TemplateSettingUnit.propTypes = {
    treeData: PropTypes.array.isRequired,
    setTreeData: PropTypes.func.isRequired,
    setExpandedKeys: PropTypes.func.isRequired,
    setSelectedKeys: PropTypes.func.isRequired,
    setDef1: PropTypes.func.isRequired,
    setSelectedTemKeys: PropTypes.func.isRequired,
    setExpandedTemKeys: PropTypes.func.isRequired,
    setTreeTemBillData: PropTypes.func.isRequired,
    setTreeTemPrintData: PropTypes.func.isRequired,
    setTemplatePk: PropTypes.func.isRequired,
    setSearchValue: PropTypes.func.isRequired,
    setTemplateNameVal: PropTypes.func.isRequired,
    setTemplateTitleVal: PropTypes.func.isRequired,
    setPageCode: PropTypes.func.isRequired,
    setAppCode: PropTypes.func.isRequired,
    setParentIdcon: PropTypes.func.isRequired,
    setOrgidObj: PropTypes.func.isRequired,
    setCopyId: PropTypes.func.isRequired,
    selectedKeys: PropTypes.array.isRequired,
    expandedKeys: PropTypes.array.isRequired,
    treeTemBillData: PropTypes.array.isRequired,
    treeTemPrintData: PropTypes.array.isRequired,
    def1: PropTypes.string.isRequired,
    selectedTemKeys: PropTypes.array.isRequired,
    expandedTemKeys: PropTypes.array.isRequired,
    templatePk: PropTypes.string.isRequired,
    searchValue: PropTypes.string.isRequired,
    pageCode: PropTypes.string.isRequired,
    appCode: PropTypes.string.isRequired,
    parentIdcon: PropTypes.string.isRequired,
    templateTitleVal: PropTypes.string.isRequired,
    templateNameVal: PropTypes.string.isRequired,
    orgidObj: PropTypes.object.isRequired,
    nodeKey: PropTypes.array.isRequired,
    copyId: PropTypes.string.isRequired
};
export default connect(
    (state) => ({
        treeData: state.TemplateSettingUnitData.treeData,
        treeTemBillData: state.TemplateSettingUnitData.treeTemBillData,
        treeTemPrintData: state.TemplateSettingUnitData.treeTemPrintData,
        selectedKeys: state.TemplateSettingUnitData.selectedKeys,
        expandedKeys: state.TemplateSettingUnitData.expandedKeys,
        def1: state.TemplateSettingUnitData.def1,
        selectedTemKeys: state.TemplateSettingUnitData.selectedTemKeys,
        expandedTemKeys: state.TemplateSettingUnitData.expandedTemKeys,
        templatePk: state.TemplateSettingUnitData.templatePk,
        searchValue: state.TemplateSettingUnitData.searchValue,
        pageCode: state.TemplateSettingUnitData.pageCode,
        appCode: state.TemplateSettingUnitData.appCode,
        parentIdcon: state.TemplateSettingUnitData.parentIdcon,
        templateNameVal: state.TemplateSettingUnitData.templateNameVal,
        templateTitleVal: state.TemplateSettingUnitData.templateTitleVal,
        orgidObj: state.TemplateSettingUnitData.orgidObj,
        nodeKey: state.TemplateSettingUnitData.nodeKey,
        copyId: state.TemplateSettingUnitData.copyId,
        json: state.TemplateSettingUnitData.json,
        templateType:state.TemplateSettingUnitData.templateType
    }),
    {
        setTreeData,
        setTreeTemBillData,
        setTreeTemPrintData,
        setExpandedKeys,
        setSelectedKeys,
        setDef1,
        setSelectedTemKeys,
        setExpandedTemKeys,
        setTemplatePk,
        setSearchValue,
        setPageCode,
        setAppCode,
        setParentIdcon,
        setTemplateNameVal,
        setTemplateTitleVal,
        setOrgidObj,
        setNodeKey,
        setCopyId,
        setJson,
        setTemplateType
    }
)(TemplateSettingUnit);
