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
    setNodeKey,
    setCopyId,
    setJson,
    setIsDefaultTem
} from 'Store/TemplateSetting/action';
import { Button, Modal, Menu, Dropdown, Icon } from 'antd';
import { PageLayout, PageLayoutHeader, PageLayoutLeft, PageLayoutRight } from 'Components/PageLayout';
import Ajax from 'Pub/js/ajax.js';
import Notice from 'Components/Notice';
import { ControlTip } from 'Components/ControlTip';
import PreviewModal from './showPreview';
import AssignComponent from './assignComponent';
import AppTreeComponent from './appTreeComponent';
import TemplatePage from './templatePage';
import CopyMoudle from './copyMoudle';
import PreviewMoudle from './previewMoudle';
import { openPage } from 'Pub/js/superJump';
import { GetQuery, langCheck } from 'Pub/js/utils';
import { generateTemData, generateTreeData } from './method';
import ButtonCreate from 'Components/ButtonCreate';
import { getMulti } from 'Pub/js/getMulti';
import './index.less';

class TemplateSetting extends Component {
    constructor(props) {
        super(props);
        this.param = GetQuery(this.props.location.search);
        this.state = {
            siderHeight: '280',
            autoExpandTemParent: true,
            treeTemBillData: [], //页面模板数据
            treeTemPrintData: [], //打印模板数据
            visible: false,
            alloVisible: false,
            batchSettingModalVisibel: false, //控制预览摸态框的显隐属性
            previewPrintVisible: false
        };
    }
    //复制摸态框的取消
    setCopyVisible = (visible) => {
        this.setState({
            visible: visible
        });
    };
    //设置默认模板 菜单栏
    menuFun = () => {
        let { json, isDefaultTem } = this.props;
        let isButton = false;
        if (isDefaultTem === 'y') {
            isButton = true;
        }
        return (
            <Menu onClick={this.settingClick.bind(this)}>
                <Menu.Item key='setDefault'>
                    <button disabled={isButton}>{langCheck('10180TM-000033', "pages", json)}</button>
                    {/* 国际化处理： 设置默认*/}
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item key='cancelDefault'>
                    <button disabled={!isButton}>{langCheck('10180TM-000034', "pages", json)}</button>
                    {/* 国际化处理： 取消默认*/}
                </Menu.Item>
            </Menu>
        );
    };
    //设置默认模板方法
    settingClick = (key) => {
        const { templatePk, pageCode, appCode, json } = this.props;
        let infoDataSet = {
            templateId: templatePk,
            pageCode: pageCode,
            appCode: appCode
        };
        const btnName = key.key;
        if (!templatePk) {
            Notice({ status: 'warning', msg: langCheck('10180TM-000035', "pages", json)}); /* 国际化处理： 请选择模板数据*/
            return;
        }
        let url;
        switch (btnName) {
            case 'setDefault':
                url = '/nccloud/platform/template/setDefaultTemplate.do';
                this.setDefaultFun(url, infoDataSet, langCheck('10180TM-000033', "pages", json)); /* 国际化处理： 设置默认*/
                break;
            case 'cancelDefault':
                url = '/nccloud/platform/template/cancelDefaultTemplate.do';
                this.setDefaultFun(url, infoDataSet, langCheck('10180TM-000034', "pages", json)); /* 国际化处理： 取消默认*/
                break;
            default:
                break;
        }
    };
    //按钮事件的触发
    handleClick = (code) => {
        let { def1, templatePk, appCode, json, pageCode } = this.props;
        let infoData = {
            templateId: templatePk
        };
        if (!templatePk) {
            Notice({ status: 'warning', msg: langCheck('10180TM-000035', "pages", json)}); /* 国际化处理： 请选择模板数据*/
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
                    const url = '/nccloud/platform/template/edittemplate.do';
                    const infoData = { appcode: appCode, templateid: templatePk };
                    this.ajaxFun(infoData, url, (res) => {
                        if (location.port) {
                            window.open(
                                'uclient://start/' + 'http://' + location.hostname + ':' + location.port + res.data
                            );
                        } else {
                            window.open('uclient://start/' + 'http://' + location.hostname + res.data);
                        }
                    });
                } else {
                    openPage(`ZoneSetting`, false, {
                        templetid: templatePk,
                        status: 'templateSetting',
                        appcode: appCode,//绪鹏添加（实施态需要传参清除模板缓存）
                        pcode: pageCode
                    });
                }
                break;
            case 'delete':
                let url;
                if (def1 === 'menuitem') {
                    url = `/nccloud/platform/template/deletePrintTemplate.do`;
                } else if (def1 === 'apppage') {
                    url = `/nccloud/platform/template/deleteTemplateDetail.do`;
                }
                ControlTip({
                    status: 'warning',
                    title: langCheck('10180TM-000036', "pages", json) /* 国际化处理： 删除*/,
                    msg: langCheck('10180TM-000037', "pages", json)/* 国际化处理： 你确认要删除吗？*/,
                    onOk: () => {
                        this.ajaxFun(infoData, url, (data) => {
                            Notice({
                                status: 'success',
                                msg: data.msg
                            });
                            this.reqTreeTemData();
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
    ajaxFun = (data, url, callback, events, types) => {
        Ajax({
            url: url,
            data: data,
            info: {
                name: '',
                action: ''
            },
            success: ({ data }) => {
                if (data.success) {
                    if (events) {
                        if (events && typeof events === 'function') {
                            callback(data, events);
                        } else {
                            if (events || types) {
                                callback(data, events, types);
                            }
                        }
                    } else {
                        callback(data);
                    }
                }
            }
        });
    };
    /**
     * 设置默认模板的ajax请求
     * @param url 请求路径
     * @param infoData 请求参数
     * @param textInfo 请求成功后的提示信息
     */
    setDefaultFun = (url, infoData, textInfo) => {
        let { def1, parentIdcon, json,appCode,pageCode } = this.props;
        if (def1 === 'apppage') {
            infoData.templateType = 'bill';
        } else if (def1 === 'menuitem') {
            if (textInfo === langCheck('10180TM-000034', "pages", json)) {
                /* 国际化处理： 取消默认*/
                if (infoData.pageCode) {
                    delete infoData.pageCode;
                }
                url = `/nccloud/platform/template/cancelDefaultPrintTemplate.do`;
            } else if (textInfo === langCheck('10180TM-000033', "pages", json)) {
                /* 国际化处理： 设置默认*/
                infoData.parentId = parentIdcon;
                url = `/nccloud/platform/template/setDefaultPrintTemplate.do`;
            }
            if (infoData.templateType) {
                delete infoData.templateType;
            }
        }
        this.ajaxFun(infoData, url, (data) => {
            Notice({ status: 'success', msg: data.msg });
            localStorage.removeItem(`appTempletStorage_${appCode}_${pageCode}`);//清除浏览器中的appcode和pageCode
            this.reqTreeTemData('setDefault');
        });
    };
    componentWillMount = () => {
        let callback = (json) => {
            this.props.setJson(json);
        };
        getMulti({
            moduleId: '10180TM',
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
            searchValue,
            setSearchValue
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
            if (this.param && this.param.fourAppCode && this.param.code && this.param.pageName === 'equiptool') {
                setSearchValue(this.param.fourAppCode);
                this.handleSearch(this.param.fourAppCode, this.handleExpanded, this.selectedFun);
            } else {
                this.reqTreeData(this.setInformationFun);
            }
        }
    };
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
    //树的搜索方法
    handleSearch = (value, callback, selectFun) => {
        this.ajaxFun(
            {
                search_content: value,
                containAppPage: true
            },
            `/nccloud/platform/appregister/searchappmenuitem.do`,
            (data) => {
                this.props.setTreeData(data.data);
                callback(data.data);
                if (selectFun && typeof selectFun === 'function') {
                    selectFun(data.data);
                }
            }
        );
    };
    //定位方法
    selectedFun = (treeData) => {
        if (treeData && treeData.length > 0) {
            const { setSelectedKeys, setDef1, setAppCode, setPageCode } = this.props;
            const positionObj = treeData.find((item) => item.code === this.param.code);
            setSelectedKeys([ positionObj.pk ]);
            setDef1(positionObj.def1);
            setAppCode(positionObj.appCode);
            if (positionObj.code) {
                setPageCode(positionObj.code);
            }
            this.reqTreeTemData();
        }
    };
    //右侧树组装数据
    restoreTreeTemData = (templateType, eventType) => {
        let { treeTemBillData, treeTemPrintData } = this.state;
        let { def1, expandedTemKeys, copyId, templatePk, json, setIsDefaultTem } = this.props;
        let treeData = [];
        let treeInfo;
        let treeTemBillDataArray = this.props.treeTemBillData;
        let treeTemPrintDataArray = this.props.treeTemPrintData;
        if (templateType === 'bill') {
            treeTemBillDataArray.map((item) => {
                if (item.isDefault === 'y') {
                    item.name = item.name + langCheck('10180TM-000038', "pages", json); /* 国际化处理： [默认]*/
                }
            });
            treeInfo = generateTemData(treeTemBillDataArray);
        } else if (templateType === 'print') {
            treeTemPrintDataArray.map((item) => {
                if (item.isDefault === 'y') {
                    item.name = item.name + langCheck('10180TM-000038', "pages", json); /* 国际化处理： [默认]*/
                }
            });
            treeInfo = generateTemData(treeTemPrintDataArray);
        }
        let { treeArray, treeObj } = treeInfo;
        treeArray.map((item) => {
            for (const key in treeObj) {
                if (treeObj.hasOwnProperty(key)) {
                    if (item.templateId === treeObj[key][0].parentId) {
                        item.children.push(treeObj[key][0]);
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
                        this.props.setSelectedTemKeys(newinitKeyArray);
                        this.props.setParentIdcon(treeData[0].parentId);
                        this.props.setTemplatePk(treeData[0].pk);
                        this.props.setTemplateNameVal(treeData[0].name);
                    } else if (eventType && eventType === 'copy') {
                        treeData.map((item) => {
                            if (item.children && item.children.length > 0) {
                                item.children.map((ele) => {
                                    if (copyId === ele.key) {
                                        let array = [ ...expandedTemKeys, ele.parentId ];
                                        this.props.setExpandedTemKeys(array);
                                    }
                                });
                            }
                        });
                    } else if (eventType && eventType === 'setDefault') {
                        treeData.map((item) => {
                            if (item.children && item.children.length > 0) {
                                item.children.map((ele) => {
                                    if (templatePk === ele.key) {
                                        setIsDefaultTem(ele.isDefault);

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
                        this.props.setSelectedTemKeys(newinitKeyArray);
                        this.props.setTemplatePk(treeData[0].pk);
                        this.props.setParentIdcon(treeData[0].parentId);
                        this.props.setTemplateNameVal(treeData[0].name);
                        this.props.setTemplateTitleVal(treeData[0].code);
                    } else if (eventType && eventType === 'copy') {
                        treeData.map((item) => {
                            if (item.children && item.children.length > 0) {
                                item.children.map((ele) => {
                                    if (copyId === ele.key) {
                                        let array = [ ...expandedTemKeys, ele.parentId ];
                                        this.props.setExpandedTemKeys(array);
                                    }
                                });
                            }
                        });
                    }else if (eventType && eventType === 'setDefault') {
                        treeData.map((item) => {
                            if (item.children && item.children.length > 0) {
                                item.children.map((ele) => {
                                    if (templatePk === ele.key) {
                                        setIsDefaultTem(ele.isDefault);
                                        
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
        let { def1, pageCode, appCode } = this.props;
        let infoData = {
            pageCode: pageCode,
            appCode: appCode
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
        this.ajaxFun(
            infoData,
            `/nccloud/platform/template/getTemplatesOfPage.do`,
            (data) => {
                if (templateType === 'bill') {
                    this.props.setTreeTemBillData(data.data);
                    this.restoreTreeTemData(templateType, eventType);
                } else if (templateType === 'print') {
                    this.props.setTreeTemPrintData(data.data);
                    this.restoreTreeTemData(templateType, eventType);
                }
            },
            templateType,
            eventType
        );
    };
    //单据模板树的onSelect事件
    onTemSelect = (key, e) => {
        let { def1, setIsDefaultTem } = this.props;
        if (def1 === 'apppage') {
        } else if (def1 === 'menuitem') {
            if (key.length > 0) {
                this.props.setNodeKey(e.selectedNodes[0].props.refData.nodeKey);
            }
        }
        if (key.length > 0) {
            this.props.setSelectedTemKeys(key);
            this.props.setTemplatePk(key[0]);
            this.props.setParentIdcon(e.selectedNodes[0].props.refData.parentId);
            this.props.setTemplateNameVal(e.selectedNodes[0].props.refData.name);
            this.props.setTemplateTitleVal(e.selectedNodes[0].props.refData.code);
            setIsDefaultTem(e.selectedNodes[0].props.refData.isDefault);
        }
    };
    /**
     * tree 数据请求
     */
    reqTreeData = (callBack) => {
        this.ajaxFun(
            {},
            `/nccloud/platform/appregister/querymenuitemstree.do`,
            (data, callBack) => {
                if (data.success && data.data.length > 0) {
                    this.props.setTreeData(data.data);
                    if (callBack && typeof callBack === 'function') {
                        callBack(data.data);
                    }
                }
            },
            callBack
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
    //浏览摸态框显示方法
    showModal = () => {
        this.setState({ previewPrintVisible: true });
    };
    //浏览摸态框隐藏方法
    hideModal = (visibel) => {
        this.setState({ previewPrintVisible: visibel });
    };
    //加载模板数据
    switchPageTem = () => {
        let { treeTemBillData, treeTemPrintData } = this.state;
        let { json } = this.props;
        switch (this.props.def1) {
            case 'apppage':
            return <TemplatePage 
                        dataSource={treeTemBillData}
                        langDataTitle={langCheck('10180TM-000039', "pages", json)} 
                        langNoDataTitle={langCheck('10180TM-000040', "pages", json)}
                        onSelectQuery={this.onTemSelect}
                    />
            case 'menuitem':
            return <TemplatePage 
                        dataSource={treeTemPrintData}
                        langDataTitle={langCheck('10180TM-000041', "pages", json)} 
                        langNoDataTitle={langCheck('10180TM-000042', "pages", json)}
                        onSelectQuery={this.onTemSelect}
                    />
            default:
                return (
                    <div className='noData'>
                        <p className='noDataTip'>{langCheck('10180TM-000043', "pages", json)}</p>
                        {/* 国际化处理： 请选择应用、页面查看数据*/}
                    </div>
                );
        }
    };
    //加载默认按钮
    menuBtnLoad = () => {
        const { def1, parentIdcon, json } = this.props;
        return (
            parentIdcon &&
            parentIdcon !== 'root' &&
            (def1 && (
                <Dropdown overlay={this.menuFun()} trigger={[ 'click' ]}>
                    <Button key='' className='margin-left-10' type=''>
                        {langCheck('10180TM-000044', "pages", json)}
                        {/* 国际化处理： 设置默认模板*/}
                        <Icon type='down' />
                    </Button>
                </Dropdown>
            ))
        );
    };
    render() {
        const { visible, alloVisible, batchSettingModalVisibel, previewPrintVisible } = this.state;
        const { def1, templatePk, parentIdcon, json } = this.props;
        let Btns = [
            {
                name: langCheck('10180TM-000045', "pages", json) /* 国际化处理： 修改*/,
                type: '',
                code: 'edit',
                isshow: def1 && (parentIdcon !== 'root' && parentIdcon)
            },
            {
                name: langCheck('10180TM-000036', "pages", json) /* 国际化处理： 删除*/,
                type: '',
                code: 'delete',
                isshow: def1 && (parentIdcon !== 'root' && parentIdcon)
            },
            {
                name: langCheck('10180TM-000046', "pages", json) /* 国际化处理： 复制*/,
                type: 'primary',
                code: 'copy',
                isshow: def1 && parentIdcon !== ''
            },
            {
                name: langCheck('10180TM-000047', "pages", json) /* 国际化处理： 分配*/,
                type: '',
                code: 'assign',
                isshow: def1 && (parentIdcon !== 'root' && parentIdcon)
            },
            {
                name: langCheck('10180TM-000048', "pages", json) /* 国际化处理： 浏览*/,
                type: '',
                code: 'browse',
                isshow: def1 && parentIdcon !== ''
            }
        ];
        return (
            <PageLayout
                className='nc-workbench-templateSetting'
                header={
                    <PageLayoutHeader>
                        <div>{langCheck('10180TM-000049', "pages", json)}</div>
                        {/* 国际化处理： 模板设置-集团*/}
                        <div style={{ display: 'flex' }}>
                            <ButtonCreate dataSource={Btns} onClick={this.handleClick} />
                            {this.menuBtnLoad()}
                        </div>
                    </PageLayoutHeader>
                }
            >
                <PageLayoutLeft>
                    <AppTreeComponent
                        onSelect={this.reqTreeTemData}
                        reqTreeData={this.reqTreeData}
                        setInforFun={this.setInformationFun}
                        handleSearch={this.handleSearch}
                        handleExpanded={this.handleExpanded}
                    />
                </PageLayoutLeft>
                <PageLayoutRight>
                    {this.switchPageTem()}
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
                        <PreviewMoudle
                            previewPrintVisible={previewPrintVisible}
                            hideModal={this.hideModal}
                        />
                    )} 
                    {alloVisible && (
                        <AssignComponent alloVisible={alloVisible} setAssignModalVisible={this.setAssignModalVisible} />
                    )}
                </PageLayoutRight>
            </PageLayout>
        );
    }
}
TemplateSetting.propTypes = {
    treeData: PropTypes.array.isRequired,
    setTreeData: PropTypes.func.isRequired,
    setExpandedKeys: PropTypes.func.isRequired,
    setDef1: PropTypes.func.isRequired,
    setSelectedTemKeys: PropTypes.func.isRequired,
    setTreeTemBillData: PropTypes.func.isRequired,
    setTreeTemPrintData: PropTypes.func.isRequired,
    setSearchValue: PropTypes.func.isRequired,
    setPageCode: PropTypes.func.isRequired,
    setAppCode: PropTypes.func.isRequired,
    setCopyId: PropTypes.func.isRequired,
    setIsDefaultTem: PropTypes.func.isRequired,
    setParentIdcon: PropTypes.func.isRequired,
    setNodeKey: PropTypes.func.isRequired,
    setTemplateNameVal: PropTypes.func.isRequired,
    setJson: PropTypes.func.isRequired,
    selectedKeys: PropTypes.array.isRequired,
    expandedKeys: PropTypes.array.isRequired,
    treeTemBillData: PropTypes.array.isRequired,
    treeTemPrintData: PropTypes.array.isRequired,
    def1: PropTypes.string.isRequired,
    templatePk: PropTypes.string.isRequired,
    searchValue: PropTypes.string.isRequired,
    pageCode: PropTypes.string.isRequired,
    appCode: PropTypes.string.isRequired,
    parentIdcon: PropTypes.string.isRequired,
    nodeKey: PropTypes.array.isRequired,
    copyId: PropTypes.string.isRequired,
    expandedTemKeys: PropTypes.array.isRequired,
    json: PropTypes.object.isRequired,
    isDefaultTem: PropTypes.string.isRequired
};
export default connect(
    (state) => ({
        treeData: state.TemplateSettingData.treeData,
        treeTemBillData: state.TemplateSettingData.treeTemBillData,
        treeTemPrintData: state.TemplateSettingData.treeTemPrintData,
        selectedKeys: state.TemplateSettingData.selectedKeys,
        expandedKeys: state.TemplateSettingData.expandedKeys,
        def1: state.TemplateSettingData.def1,
        selectedTemKeys: state.TemplateSettingData.selectedTemKeys,
        templatePk: state.TemplateSettingData.templatePk,
        searchValue: state.TemplateSettingData.searchValue,
        pageCode: state.TemplateSettingData.pageCode,
        appCode: state.TemplateSettingData.appCode,
        parentIdcon: state.TemplateSettingData.parentIdcon,
        nodeKey: state.TemplateSettingData.nodeKey,
        copyId: state.TemplateSettingData.copyId,
        expandedTemKeys: state.TemplateSettingData.expandedTemKeys,
        json: state.TemplateSettingData.json,
        isDefaultTem: state.TemplateSettingData.isDefaultTem
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
        setTemplateNameVal,
        setTemplateTitleVal,
        setTemplatePk,
        setSearchValue,
        setPageCode,
        setAppCode,
        setParentIdcon,
        setNodeKey,
        setCopyId,
        setJson,
        setIsDefaultTem
    }
)(TemplateSetting);
