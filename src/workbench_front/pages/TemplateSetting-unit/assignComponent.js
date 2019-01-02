import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Button, Modal, Tree, Input, Select } from 'antd';
import _ from "lodash";
import Ajax from 'Pub/js/ajax.js';
import Notice from 'Components/Notice';
import BusinessUnitGroupTreeRef from 'Components/Refers/BusinessUnitGroupTreeRef';
import Svg from 'Components/Svg';
import { setRoCheckedObjArray, setRoleUserDatas } from 'Store/TemplateSetting-unit/action';
import { generateTreeData, generateRoData } from './method';
import { initRoTreeData, initUserTreeData, initRoTreeData2, initUserTreeData2 } from './datas';
import { langCheck } from 'Pub/js/utils';
const Option = Select.Option;
const TreeNode = Tree.TreeNode;
const Search = Input.Search;
class AssignComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expandedKeys: [],
            roleSearchValue: '',
            autoExpandParent: true,
            nodeKeyValue: this.props.nodeKey ? (this.props.nodeKey.length > 0 ? this.props.nodeKey[0] : '') : '',
            treeRoData: [],
            allowDataArray: [],
            org_df_biz: _.cloneDeep(this.props.orgidObj),
            treeAllowedData: [],
            allowedTreeKey: '',
            roCheckedKeys: [],
            allowedCheckedKeys: []
        };
    }
    componentDidMount() {
        let { org_df_biz } = this.state;
        if (org_df_biz.refpk) {
            this.reqRoTreeData();
        }
    }
    //已分配用户和职责的数据请求
    reqAllowTreeData = () => {
        let { org_df_biz, nodeKeyValue } = this.state;
        const { templatePk, def1, pageCode, appCode, json } = this.props;
        let infoData = {
            pageCode: pageCode,
            orgId: org_df_biz.refpk,
            templateId: templatePk,
            appCode: appCode
        };
        if (def1 === 'apppage') {
            infoData.templateType = 'bill';
        } else if (def1 === 'menuitem') {
            infoData.templateType = 'print';
            if (infoData.pageCode) {
                delete infoData.pageCode;
            }
            infoData.pageCode = nodeKeyValue;
        }
        Ajax({
            url: `/nccloud/platform/template/listAssignmentsOfTemplate.do`,
            info: {
                name: langCheck('10181TM-000000',"pages", json) /* 国际化处理： 模板设置模块*/,
                action: langCheck('10181TM-000001',"pages", json) /* 国际化处理： 已分配用户和职责*/
            },
            data: infoData,
            success: ({ data }) => {
                if (data.success) {
                    this.setState(
                        {
                            allowDataArray: data.data
                        },
                        this.restoreAllowedTree
                    );
                }
            }
        });
    };
    //已分配用户和角色的数据的组装
    restoreAllowedTree = () => {
        let { allowDataArray, treeAllowedData } = this.state;
        allowDataArray.map((item) => {
            item.text = `${item.code}  ${item.name}`;
            item.key = item.id;
            item.pk = item.id;
        });
        treeAllowedData = generateTreeData(allowDataArray);
        this.setState({
            treeAllowedData
        });
    };
    //角色和用户的数据请求
    reqRoTreeData = () => {
        let { org_df_biz } = this.state;
        let { json } = this.props;
        if (!org_df_biz.refpk) {
            return;
        }
        let infoData = {
            orgId: org_df_biz.refpk
        };
        Ajax({
            url: `/nccloud/platform/template/getAllRoleUserAndResp.do`,
            info: {
                name: langCheck('10181TM-000002',"pages", json) /* 国际化处理： 应用注册模块*/,
                action: langCheck('10181TM-000003',"pages", json) /* 国际化处理： 角色和用户职责*/
            },
            data: infoData,
            success: ({ data }) => {
                if (data.success && data.data) {
                    if (data.data.roles || data.data.users || data.data.resps) {
                        this.restoreRoTreeData(data.data);
                    }
                    this.props.setRoleUserDatas(data.data);
                    this.reqAllowTreeData();
                }
            }
        });
    };
    //用户和角色数据的组装
    restoreRoTreeData = (data) => {
        let { treeRoData } = this.state;
        let { json } = this.props;
        treeRoData = [];
        initRoTreeData.text = langCheck('10181TM-000004',"pages", json); /* 国际化处理： 角色*/
        initUserTreeData.text = langCheck('10181TM-000005',"pages", json); /* 国际化处理： 用户*/
        let initRolesData = initRoTreeData;
        let initUsersData = initUserTreeData;
        data.roles.map((item) => {
            item.type = 'roles';
        });
        data.users.map((item) => {
            item.type = 'users';
        });
        initRolesData.children = generateRoData(data.roles);
        initUsersData.children = generateRoData(data.users);
        treeRoData.push(initRolesData);
        treeRoData.push(initUsersData);
        treeRoData = generateTreeData(treeRoData);
        this.setState({
            treeRoData
        });
    };
    //用户和角色的树点击方法
    selectRoFun = (e) => {
        let { roCheckedKeys } = this.state;
        const pk = e.node.props.refData.key;
        let index = roCheckedKeys.indexOf(pk);
        if (index > -1) {
            roCheckedKeys.splice(index, 1);
        } else {
            roCheckedKeys.push(pk);
        }
        this.setState(
            {
                roCheckedKeys: [ ...roCheckedKeys ]
            },
            this.lookCheckDataFun
        );
    };
    //数组去重
    arrayUnique = (array) => {
        var r = [];
        for (var i = 0, l = array.length; i < l; i++) {
            for (var j = i + 1; j < l; j++) if (array[i].id == array[j].id) j == ++i;
            r.push(array[i]);
        }
        return r;
    };
    //分配和取消分配方法
    allowClick = (name) => {
        let { allowDataArray, treeAllowedData, allowedCheckedKeys } = this.state;
        let { roCheckedObjArray, json } = this.props;
        switch (name) {
            case 'allowRole':
                if (roCheckedObjArray && roCheckedObjArray.length === 0) {
                    Notice({ status: 'warning', msg: langCheck('10181TM-000006',"pages", json) }); /* 国际化处理： 请选中信息*/
                    return;
                }
                //数组去重
                allowDataArray = allowDataArray.concat(roCheckedObjArray);
                allowDataArray = this.arrayUnique(allowDataArray);
                treeAllowedData = generateTreeData(allowDataArray);
                break;
            case 'allowRoleCancel':
                if (allowedCheckedKeys && allowedCheckedKeys.length === 0) {
                    Notice({ status: 'warning', msg: langCheck('10181TM-000006',"pages", json) }); /* 国际化处理： 请选中信息*/
                    return;
                }
                Array.prototype.remove = function(val) {
                    let index = this.indexOf(val);
                    if (index > -1) {
                        this.splice(index, 1);
                    }
                };
                let len = allowedCheckedKeys.length;
                for (let i = len - 1; i >= 0; i--) {
                    for (let j = 0; j < allowDataArray.length; j++) {
                        if (allowedCheckedKeys[i]) {
                            if (allowDataArray[j].id === allowedCheckedKeys[i]) {
                                allowDataArray.remove(allowDataArray[j]);
                            }
                        }
                    }
                }
                treeAllowedData = generateTreeData(allowDataArray);
                break;
            default:
                break;
        }
        this.setState({
            treeAllowedData,
            allowDataArray,
            allowedCheckedKeys
        });
    };
    //已分配树节点的选中方法
    onSelectedAllow = (e) => {
        let { allowedCheckedKeys } = this.state;
        const pk = e.node.props.refData.id;
        let index = allowedCheckedKeys.indexOf(pk);
        if (index > -1) {
            allowedCheckedKeys.splice(index, 1);
        } else {
            allowedCheckedKeys.push(pk);
        }
        this.setState({
            allowedCheckedKeys: [ ...allowedCheckedKeys ]
        });
    };
    //树点击事件的集合
    onSelect = (typeSelect, e) => {
        switch (typeSelect) {
            case 'resOnselect':
                this.selectRoFun(e);
                break;
            case 'allowedOnselect':
                this.onSelectedAllow(e);
            default:
                break;
        }
    };
    onExpand = (expandedKeys) => {
        this.setState({ expandedKeys, autoExpandParent: false });
    };
    //树的查询方法
    onSearch = (e) => {
        const value = e.target.value;
        let { roleUserDatas, json } = this.props;
        let expandedKeys = [];
        let searchTrees = [];
        let treeRoDataArry = [];
        if (value) {
            for (let key in roleUserDatas) {
                if (roleUserDatas.hasOwnProperty(key)) {
                    if (key === 'users' || key === 'roles') {
                        roleUserDatas[key].map((item) => {
                            item.text = `${item.code}  ${item.name}`;
                            if (item.text.indexOf(value) > -1) {
                                expandedKeys.push(item.key);
                                searchTrees.push(item);
                            }
                        });
                    }
                }
            }
            searchTrees.map((item) => {
                item.key = item.id;
            });
            initRoTreeData2.text = langCheck('10181TM-000004',"pages", json); /* 国际化处理： 角色*/
            initUserTreeData2.text = langCheck('10181TM-000005',"pages", json); /* 国际化处理： 用户*/
            let initRolesData = _.cloneDeep(initRoTreeData2);
            let initUsersData = _.cloneDeep(initUserTreeData2);
            searchTrees.map((item) => {
                if (item.type === 'roles') {
                    initRolesData.children.push(item);
                } else if (item.type === 'users') {
                    initUsersData.children.push(item);
                }
            });
            treeRoDataArry.push(initRolesData);
            treeRoDataArry.push(initUsersData);
            treeRoDataArry = generateTreeData(treeRoDataArry);
            expandedKeys.push('abc1234567');
            expandedKeys.push('abc2234567');
            this.setState({
                expandedKeys,
                roleSearchValue: value,
                autoExpandParent: true,
                treeRoData: treeRoDataArry
            });
        } else {
            this.restoreRoTreeData(roleUserDatas);
            this.setState({
                roleSearchValue: value,
                expandedKeys: []
            });
        }
    };
    //树双击展开
    hanldeDoubleClick = (typeSelect, node) => {
        let nodeDataoMduleid;
        let expandedKeys = [];
        switch (typeSelect) {
            case 'resOnselect':
                nodeDataoMduleid = node.props.refData.key;
                expandedKeys = this.state.expandedKeys.concat([ nodeDataoMduleid ]);
                this.setState({
                    expandedKeys
                });
                break;
            default:
                break;
        }
    };
    //复选框事件
    onCheck = (typeSelect, checkedKeys) => {
        switch (typeSelect) {
            case 'resOnselect':
                this.onCheckRoFun(checkedKeys);
                break;
            case 'allowedOnselect':
                this.onCheckAllowedFun(checkedKeys);
            default:
                break;
        }
    };
    onCheckRoFun = (checkedKeys) => {
        this.setState(
            {
                roCheckedKeys: checkedKeys
            },
            this.lookCheckDataFun
        );
    };
    lookCheckDataFun = () => {
        const { roCheckedKeys } = this.state;
        const { roleUserDatas } = this.props;
        let filterData = roCheckedKeys.filter((item) => item !== 'abc1234567' && item !== 'abc2234567');
        let array = [];
        filterData.map((item) => {
            let obj = {};
            for (let key in roleUserDatas) {
                roleUserDatas[key].map((ele) => {
                    if (ele.id === item) {
                        obj.key = ele.id;
                        obj.pk = ele.id;
                        obj.text = `${ele.code}  ${ele.name}`;
                        obj.code = ele.code;
                        obj.id = ele.id;
                        if (key === 'users') {
                            obj.type = 'user';
                        } else if (key === 'roles') {
                            obj.type = 'role';
                        }
                    }
                });
            }
            array.push(obj);
        });
        this.props.setRoCheckedObjArray(array);
    };
    onCheckAllowedFun = (checkedKeys) => {
        this.setState({
            allowedCheckedKeys: checkedKeys
        });
    };
    /**
     * 查询框删除按钮
     */
    handleSearchDel = () => {
        const { roleUserDatas } = this.props;
        this.restoreRoTreeData(roleUserDatas);
        this.setState({
            roleSearchValue: '',
            expandedKeys: []
        });
    };
    //树组件
    treeResAndUser = (data, typeSelect, hideSearch, searchValue, classType) => {
        const { expandedKeys, autoExpandParent } = this.state;
        const { json } = this.props;
        const loop = (data) => {
            return data.map((item) => {
                let { text, id } = item;
                let title;
                if (typeSelect === 'resOnselect') {
                    const index = text.indexOf(searchValue);
                    const beforeStr = text.substr(0, index);
                    const afterStr = text.substr(index + searchValue.length);
                    title =
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
                } else if (typeSelect === 'allowedOnselect') {
                    title = text;
                }

                if (item.children && item.children.length > 0) {
                    return (
                        <TreeNode
                            key={id}
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
                return <TreeNode icon={<span className='tree-dot' />} key={id} title={title} refData={item} />;
            });
        };
        return (
            <div className={classType ? classType : ''}>
                {hideSearch ? (
                    ''
                ) : (
                    <div className='fixed-search-input'>
                        <Search
                            style={{ marginBottom: 8, marginTop: 8 }}
                            placeholder={langCheck('10181TM-000007',"pages", json)} /* 国际化处理： 角色或用户查询*/
                            onChange={this.onSearch}
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
                        checkable
                        onExpand={this.onExpand}
                        expandedKeys={expandedKeys}
                        onSelect={(e, node) => {
                            this.onSelect(typeSelect, node);
                        }}
                        autoExpandParent={autoExpandParent}
                        onDoubleClick={(e, node) => {
                            this.hanldeDoubleClick(typeSelect, node);
                        }}
                        onCheck={(node) => {
                            this.onCheck(typeSelect, node);
                        }}
                        checkedKeys={
                            typeSelect == 'resOnselect' ? (
                                this.state.roCheckedKeys
                            ) : typeSelect == 'allowedOnselect' ? (
                                this.state.allowedCheckedKeys
                            ) : (
                                ''
                            )
                        }
                    >
                        {loop(data)}
                    </Tree>
                )}
            </div>
        );
    };
    //模态框确定按钮方法
    handleAlloOk = () => {
        let { treeAllowedData, org_df_biz, nodeKeyValue } = this.state;
        const { templatePk, def1, pageCode, appCode, json } = this.props;
        if (!org_df_biz.refpk) {
            Notice({ status: 'warning', msg: langCheck('10181TM-000008',"pages", json) }); /* 国际化处理： 业务单元信息为空*/
            return;
        }
        if (!treeAllowedData) {
            Notice({ status: 'warning', msg: langCheck('10181TM-000006',"pages", json) }); /* 国际化处理： 请选中信息*/
            return;
        }
        let targets = {};
        for (let i = 0; i < treeAllowedData.length; i++) {
            let allowedData = treeAllowedData[i];
            for (let key in allowedData) {
                if (key === 'id') {
                    targets[allowedData[key]] = allowedData.type;
                }
            }
        }
        let newTargets = '';
        for (let key in targets) {
            newTargets = newTargets + `${key}:${targets[key]},`;
        }
        const newTargetsLen = newTargets.length;
        newTargets = newTargets.substr(0, newTargetsLen - 1);
        let infoData = {
            pageCode: pageCode,
            templateId: templatePk,
            orgId: org_df_biz.refpk,
            appCode: appCode
        };
        infoData.targets = newTargets;
        if (def1 === 'apppage') {
            infoData.templateType = 'bill';
        } else if (def1 === 'menuitem') {
            infoData.templateType = 'print';
            if (infoData.pageCode) {
                delete infoData.pageCode;
            }
            if (nodeKeyValue) {
                infoData.pageCode = nodeKeyValue;
            }
        }
        Ajax({
            url: `/nccloud/platform/template/assignTemplate.do`,
            data: infoData,
            info: {
                name: langCheck('10181TM-000009',"pages", json) /* 国际化处理： 模板设置*/,
                action: langCheck('10181TM-000010',"pages", json) /* 国际化处理： 模板分配保存*/
            },
            success: ({ data }) => {
                if (data.success) {
                    Notice({ status: 'success', msg: langCheck('10181TM-000011',"pages", json) }); /* 国际化处理： 分配成功*/
                    this.props.setAssignModalVisible(false);
                    localStorage.removeItem(`appTempletStorage_${appCode}_${pageCode}`);//清除浏览器中的appcode和pageCode
                }
            }
        });
    };
    //摸态框取消按钮方法
    handleOrlCancel = () => {
        this.props.setAssignModalVisible(false);
    };
    //业务单元参照回调方法
    handdleRefChange = (value) => {
        let { org_df_biz } = this.state;
        let { refname, refcode, refpk } = value;
        org_df_biz['refname'] = refname;
        org_df_biz['refcode'] = refcode;
        org_df_biz['refpk'] = refpk;
        this.setState(
            {
                org_df_biz
            },
            this.reqRoTreeData
        );
    };
    render() {
        const { treeRoData, treeAllowedData, org_df_biz, roleSearchValue } = this.state;
        const { def1, nodeKey, pageCode, json } = this.props;
        return (
            <Modal
                closable={false}
                title={langCheck('10181TM-000012',"pages", json)} /* 国际化处理： 多角色和用户模板分配*/
                visible={this.props.alloVisible}
                onOk={this.handleAlloOk}
                onCancel={this.handleOrlCancel}
                width={720}
                maskClosable={false}
                okText={langCheck('10181TM-000013',"pages", json)} /* 国际化处理： 确定*/
                cancelText={langCheck('10181TM-000014',"pages", json)} /* 国际化处理： 取消*/
                centered={true}
                bodyStyle={{ padding: '15px 0px 0px 0px' }}
            >
                <div className='allocationPage'>
                    <div className='pageCode-show'>
                        <p className='pageCodeName'>
                            <span>{json['10181TM-000017']}</span>
                            {/* 国际化处理： 功能节点*/}
                            <span>{pageCode ? pageCode : ''}</span>
                        </p>
                        {def1 === 'menuitem' && (
                            <div>
                                <label htmlFor=''>{langCheck('10181TM-000018',"pages", json)}</label>
                                {/* 国际化处理： 节点标识*/}
                                <Select
                                    showSearch
                                    style={{ width: 200 }}
                                    placeholder={langCheck('10181TM-000015',"pages", json)} /* 国际化处理： 节点标识符*/
                                    optionFilterProp='children'
                                    onSelect={(e) => {
                                        this.setState({
                                            nodeKeyValue: e
                                        });
                                    }}
                                    defaultValue={nodeKey[0]}
                                    filterOption={(input, option) =>
                                        option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                                >
                                    {nodeKey &&
                                        nodeKey.length > 0 &&
                                        nodeKey.map((item, index) => {
                                            if (item) {
                                                return <Option value={item}>{item}</Option>;
                                            }
                                        })}
                                </Select>
                            </div>
                        )}
                    </div>
                    <div className='allocationPage-content'>
                        <div className='allocation-select'>
                            <div>
                                <label htmlFor=''>{langCheck('10181TM-000019',"pages", json)}</label>
                                {/* 国际化处理： 业务单元*/}
                                <BusinessUnitGroupTreeRef
                                    value={org_df_biz}
                                    placeholder={langCheck('10181TM-000016',"pages", json)} /* 国际化处理： 默认业务单元*/
                                    onChange={(value) => {
                                        this.handdleRefChange(value);
                                    }}
                                />
                            </div>
                        </div>
                        <div className='allocationPage-content-tree'>
                            <div className='allocation-treeScrollName'>
                                {this.treeResAndUser(
                                    treeRoData,
                                    'resOnselect',
                                    null,
                                    roleSearchValue,
                                    'searchTree-assign'
                                )}
                            </div>
                            <div className='allocation-button'>
                                <p>
                                    <Button onClick={this.allowClick.bind(this, 'allowRole')}>
                                        <i className='icon iconfont icon-jiantouyou' />
                                    </Button>
                                </p>
                                <p>
                                    <Button onClick={this.allowClick.bind(this, 'allowRoleCancel')}>
                                        <i className='icon iconfont icon-jiantouzuo' />
                                    </Button>
                                </p>
                            </div>
                            <div className='allocation-treeContainer'>
                                {treeAllowedData.length > 0 &&
                                    this.treeResAndUser(treeAllowedData, 'allowedOnselect', 'hideSearch')}
                            </div>
                        </div>
                    </div>
                </div>
            </Modal>
        );
    }
}
AssignComponent.propTypes = {
    templatePk: PropTypes.string.isRequired,
    roCheckedObjArray: PropTypes.array.isRequired,
    setRoCheckedObjArray: PropTypes.func.isRequired,
    setRoleUserDatas: PropTypes.func.isRequired,
    nodeKey: PropTypes.array.isRequired,
    roleUserDatas: PropTypes.object.isRequired,
    orgidObj: PropTypes.object.isRequired
};
export default connect(
    (state) => ({
        templatePk: state.TemplateSettingUnitData.templatePk,
        def1: state.TemplateSettingUnitData.def1,
        nodeKey: state.TemplateSettingUnitData.nodeKey,
        appCode: state.TemplateSettingUnitData.appCode,
        pageCode: state.TemplateSettingUnitData.pageCode,
        roCheckedObjArray: state.TemplateSettingUnitData.roCheckedObjArray,
        roleUserDatas: state.TemplateSettingUnitData.roleUserDatas,
        orgidObj: state.TemplateSettingUnitData.orgidObj,
        json: state.TemplateSettingUnitData.json
    }),
    {
        setRoCheckedObjArray,
        setRoleUserDatas
    }
)(AssignComponent);
