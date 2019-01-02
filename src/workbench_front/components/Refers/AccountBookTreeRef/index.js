import React, { Component } from 'react';
import { base, high, ajax, toast } from 'nc-lightapp-front';
const { Refer } = high;
const { PopRefer } = high.Refer, // 引入PopRefer类
    { NCRadio: Radio, NCTree, NCMenu, NCDropdown, NCButton, NCFormControl, NCCheckbox } = base,
    { NCRadioGroup: RadioGroup } = Radio;
const TreeNode = NCTree.NCTreeNode;
import { langCheck } from 'Pub/js/utils';
import './index.less';
class ReferTree extends Component {
    static defaultProps = {
        defaultExpandAll: false
    };

    constructor(props) {
        super(props);
        this.state = {
            datas: [],
            searchValue: undefined
        };
    }
    componentWillMount() {
        this.state.datas = this.props.data;
        this.setState(this.state);
    }

    componentWillReceiveProps(nextProps) {
        this.state.datas = nextProps.data;
        this.state.searchValue = nextProps.searchValue;
        this.setState(this.state);
    }
    onExpand() {
        console.log('onExpand');
    }
    render() {
        // var renderTitle = (item) => {
        // 	return item.refpk == 'root' ? item.refname :  item.nodeData.nodecode + ' ' + item.nodeData.nodetitle;
        // }
        // const { data, ...otherProps } = this.props;
        // const loop = (datas) => datas.map((item) => {
        // 	var children = item.children || [];
        //     return (<NCTree.NCTreeNode title={renderTitle(item)} key={item.refpk} isLeaf={children.length == 0}  treeNodeData={item.nodeData|| {}} nodeData={item.nodeData|| {}} >{children.length == 0? '' :loop(children)}</NCTree.NCTreeNode>)
        // });
        // return (
        // 	<NCTree{...otherProps}>{loop(this.state.datas)}</NCTree>
        // );
        //---------------------------------------------------------------
        const { data, ...otherProps } = this.props;
        var textValue = this.state.searchValue;
        var renderTreeTitle = (item, icon) => {
            var isLeaf = !item.children || item.children == 0,
                isExpand = this.props.expandedKeys.includes(item.refpk);

            // if(item && item.hasOwnProperty('children')&& item.children.length !=null){
            //     className = this.props.expandedKeys.includes(item.refpk)?"refer-tree-switch iconfont icon-wenjianjiadakai":"refer-tree-switch iconfont icon-wenjianjia";
            // }else{
            //     className = "refer-tree-point";
            // }
            var drawTitleString = (title, icon) => {
                let className = icon
                    ? isLeaf
                      ? 'refer-tree-point'
                      : isExpand
                        ? 'refer-tree-switch iconfont icon-wenjianjiadakai'
                        : 'refer-tree-switch iconfont icon-wenjianjia'
                    : '';
                if (textValue && textValue.length > 0 && title && title.length > 0 && title.indexOf(textValue) != -1) {
                    var start = title.indexOf(textValue),
                        end = start + textValue.length;
                    return [
                        <span className={className} />,
                        <span className='refer-tree-title' style={{ margin: 0, padding: 0 }}>
                            <span>{title.substring(0, start)}</span>
                            <span
                                style={{
                                    color: '#f50',
                                    transition: 'all .3s?ease',
                                    'font-weight': 'bold'
                                }}
                                className='uapbd-cashflow-treefilter-highlight'
                            >
                                {textValue}
                            </span>
                            <span>{title.substring(end, title.length)}</span>
                        </span>
                    ];
                } else {
                    return [
                        <span className={className} />,
                        <span className='refer-tree-title' style={{ margin: 0, padding: 0 }}>
                            {title}
                        </span>
                    ];
                }
            };
            var title = item.refpk == 'root' ? ' ' : item.nodeData.nodetitle;
            var code = item.refpk == 'root' ? '' : item.nodeData.nodecode;

            return [
                drawTitleString(code, true),
                <span className='refer-tree-title' style={{ margin: 0, padding: 0 }}>
                    &nbsp;&nbsp;
                </span>,
                drawTitleString(title, false)
            ];
        };
        const loop = (datas, pdata) => {
            return datas
                .filter((item) => {
                    return (
                        (item.needShow == undefined && item.needExpand == undefined) ||
                        item.needShow ||
                        item.needExpand ||
                        item.key == 'root'
                    );
                })
                .map((item) => {
                    var children = item.children || [];
                    return (
                        <NCTree.NCTreeNode
                            title={renderTreeTitle(item)}
                            key={item.refpk}
                            isLeaf={children.length == 0}
                            treeNodeData={item.nodeData || {}}
                            nodeData={item.nodeData || {}}
                        >
                            {children.length == 0 ? <i class='tree-dian' /> : loop(children)}
                        </NCTree.NCTreeNode>
                    );
                });
        };
        return (
            <div className='refer-tree-wrapper'>
                <div className='refer-tree-container'>
                    <NCTree {...otherProps}>{loop(this.state.datas)}</NCTree>
                </div>
            </div>
        );
    }
}

class Ref extends PopRefer {
    // 继承PopRefer类
    constructor(props) {
        super(props);
        this.interval = 0;
        this.state = {
            ...this.state, // 继承state
            treetype: 'type',
            textValue: undefined,

            subOrg: {
                defaultChecked: false,
                checked: false,
                onChange: (val) => {
                    this.state.subOrg.checked = val;
                    this.state.includeChildren = val;
                    this.setState(this.state, () => {});
                }
            },
            mshowoff: {
                defaultChecked: false,
                checked: false,
                onChange: (val) => {
                    this.state.mshowoff.checked = val;
                    this.setState(this.state, () => {
                        this.onTreeTypeChange(this.state.treetype);
                    });
                }
            },
            refGroup: {
                value: undefined,
                refType: 'tree',
                refName: langCheck('0000PUB-000031') /* 国际化处理： 集团(所有)*/,
                placeholder: langCheck('0000PUB-000031') /* 国际化处理： 集团(所有)*/,
                refCode: 'uapbd.org.GroupDefaultTreeRef',
                queryTreeUrl: '/nccloud/uapbd/ref/GroupDefaultTreeRef.do',
                treeConfig: {
                    name: [ langCheck('0000PUB-000032'), langCheck('0000PUB-000033') ] /* 国际化处理： 编码,名称*/,
                    code: [ 'refcode', 'refname' ]
                },
                rootNode: { refname: langCheck('0000PUB-000031'), refpk: 'root' } /* 国际化处理： 集团(所有)*/,
                isMultiSelectedEnabled: false,
                onChange: (val) => {
                    this.state.refGroup.value = val;
                    this.setState(this.state, () => {
                        this.onTreeTypeChange(this.state.treetype);
                    });
                }
            },
            search: {
                className: 'AccountBookTreeref-Search',
                valueTemp: undefined,
                value: undefined,
                placeholder: langCheck('0000PUB-000034') /* 国际化处理： 账簿编码/账簿名称*/,
                onChange: (value) => {
                    this.interval = new Date().getTime();
                    let s = setTimeout(() => {
                        //停止输入0.5s后执行
                        if (new Date().getTime() - this.interval >= 500) {
                            this.state.search.value = this.state.search.valueTemp;
                            this.setState(this.state, () => {
                                this.state.search.onSearch();
                            });
                        }
                        clearTimeout(s);
                    }, 500);
                    this.state.search.valueTemp = value;
                    this.setState(this.state);
                },
                onSearch: () => {
                    var textValue = this.state.search.value || '',
                        expandKeys = [];
                    const loopsearch = (nodes = []) => {
                        var parendExpand = false;
                        (nodes || []).forEach((child) => {
                            var expand = loopsearch(child.children || []);
                            child.needExpand = expand;
                            child.needShow = expand
                                ? true
                                : child.nodeData.nodedata == 'nodeclass' ||
                                  child.nodeData.nodecode.indexOf(textValue) != -1 ||
                                  child.title.indexOf(textValue) != -1
                                  ? true
                                  : false;
                            parendExpand = parendExpand ? parendExpand : child.needShow;
                            if (expand) {
                                expandKeys.push(child.key);
                            }
                        });
                        return parendExpand;
                    };
                    if (textValue && textValue.length != 0) {
                        var rootExpand = loopsearch(this.state.treeData || []);
                        expandKeys.push('root');
                        this.state.expandedKeys = expandKeys;
                        this.setState(this.state);
                    } else {
                        this.state.expandedKeys = [];
                        this.setState(this.state);
                    }
                }
            }
        };
        this.selectRootKeys = [];
        this.showGroup = props.showGroup;
        this.showInCludeChildren = props.showInCludeChildren;
        this.disabledDataShow = props.disabledDataShow || false;
    }

    onTreeTypeChange = (value) => {
        this.state.treetype = value;
        this.setState(this.state, () => {
            this.loadTreeData(this.getParam()).then((data) => {
                var rootTitle =
                    value === 'type' ? langCheck('0000PUB-000035') : langCheck('0000PUB-000036'); /* 国际化处理： 账簿类型,主账簿*/
                var root = {
                    refname: rootTitle,
                    refpk: 'root'
                };
                this.setTreeData('treeData', root, data);
            });
        });
    };

    show = () => {
        this.setState(
            {
                isShow: true,
                isFirstShow: false,
                dropDownShow: false,
                isSelectedShow: false,
                searchVal: '',
                treeSearchVal: '',
                selectedShow: false
            },
            () => {
                let { disabled, isTreelazyLoad, idKey } = this.props,
                    { selectedValues, isFirstShow, treeData, selectedKeys, activeKey, expandedKeys } = this.state;
                if (disabled) {
                    return false;
                }
                document.body.style.overflow = 'hidden';
                //缓存旧数据，做取消用
                let { refType, isCacheable, queryGridUrl, queryTreeUrl, rootNode, pageSize } = this.props,
                    { tableData, isSearch, searchVal, isTreeSearch, treeSearchVal } = this.state,
                    param;
                // if (isFirstShow) {
                if (refType === 'grid') {
                    param = this.__getParam({
                        pageInfo: tableData[0].page
                    });
                    // isSearch && (param.keyword = searchVal);
                    this.loadAndSetTableData(param);
                } else {
                    param = this.__getParam({
                        pid: isTreelazyLoad ? rootNode[idKey] : '',
                        pageInfo: {
                            pageSize,
                            pageIndex: -1
                        }
                    });
                    // isTreeSearch && (param.keyword = treeSearchVal);
                    this.loadAndSetTreeData(param, rootNode, expandedKeys);
                    if (refType === 'gridTree') {
                        tableData[0].rows = [];
                        selectedKeys = [];
                    }
                    this.setState({
                        tableData,
                        selectedKeys: []
                        // expandedKeys: [ rootNode[idKey] ]
                    });
                }
                // }
            }
        );
    };

    getParam = (param = {}) => {
        debugger;
        var { queryCondition } = this.props,
            queryCondition = queryCondition
                ? typeof queryCondition === 'function'
                  ? queryCondition()
                  : typeof queryCondition === 'object' ? queryCondition : {}
                : {};
        var groupParam = {};
        if (this.showGroup) {
            groupParam = {
                refpkGroup:
                    this.state.refGroup.value && this.state.refGroup.value.refpk
                        ? this.state.refGroup.value.refpk
                        : '-1',
                showGroup: true
            };
        }
        return {
            queryCondition: {
                ...queryCondition,
                treetype: this.state.treetype,
                textValue: this.state.textValue,
                ...groupParam,
                isshow: this.state.isShow,
                disabledDataShow: this.disabledDataShow ? this.state.mshowoff.checked || false : false
            },
            pageInfo: { pageSize: 10, pageIndex: 1 } //放置报错
        };
    };

    loadTreeData = async (param) => {
        return await new Promise((resolve) => {
            this.setState({ loading: true }, () => {
                let { currentLevel, referVal } = this.state;
                let { queryTreeUrl, queryCondition, isCacheable } = this.props;
                //判断是否启用了集团，
                ajax({
                    url: queryTreeUrl,
                    data: param,
                    loading: false,
                    success: (res) => {
                        this.setState({ loading: false }, () => {
                            if (!res.success) {
                                throw new Error(res.error.message);
                                return;
                            }
                            res.data.datarows.forEach((e) => {
                                e.nodeData.refpk = e.nodeData.nodeid;
                                e.nodeData.refname = e.nodeData.nodetitle;
                                e.nodeData.refcode = e.nodeData.nodecode;
                                e.refcode = e.nodeData.nodecode;
                            });
                            var newData = {
                                //满足平台的格式
                                rows: res.data.datarows
                            };
                            this.setCacheData(queryTreeUrl, param, newData);
                            resolve(newData);
                        });
                    },
                    error: (e) => {
                        toast({ color: 'danger', content: e.message });
                        this.setState({
                            loading: false
                        });
                        throw new Error(e);
                    }
                });
            });
        });
    };

    onTreeNodeSelectWapper(selectedKeys, { selected, selectedNodes, node, event }, ...rest) {
        debugger;
        if (this.state.treetype == 'type' && node.props.treeNodeData.nodedata == 'nodeclass') {
            var expandedKeys = this.state.expandedKeys,
                nodeKey = node.props.eventKey;
            expandedKeys =
                expandedKeys.indexOf(nodeKey) == -1
                    ? [ ...expandedKeys, nodeKey ]
                    : expandedKeys.filter((e) => e != nodeKey);
            this.state.expandedKeys = expandedKeys;
            this.setState(this.state);
            return;
        }
        this.onTreeNodeSelect(selectedKeys, { selected, selectedNodes, node, event }, ...rest);
    }
    onTreeNodeDoubleClickWapper(selectedKeys, { selected, selectedNodes, node, event }, ...rest) {
        if (this.state.treetype == 'type' && node.props.treeNodeData.nodedata == 'nodeclass') {
            return;
        }
        this.onTreeNodeDoubleClick(selectedKeys, { selected, selectedNodes, node, event }, ...rest);
    }

    onTreeNodeCheckWapper(checkedKeys, { checked, checkedNodes, node, event }) {
        // if(this.state.treetype == 'type' && node.props.treeNodeData.nodedata == 'nodeclass')
        // 	return;
        this.onTreeNodeCheck(checkedKeys, {
            checked,
            checkedNodes,
            node,
            event
        });
    }

    onTreeNodeCheck = (checkedKeys, { checked, checkedNodes, node, event }) => {
        // console.log(checkedKeys, { checked, checkedNodes, node, event });
        const { rootNode, onlyLeafCanSelect, idKey } = this.props;
        let { selectedValues, treeData } = this.state;
        selectedValues = this.getSelectTreeValuesThroughIncludeChildrenforme(node, checked);
        this.setState({
            selectedValues
        });
    };

    getSelectTreeValuesThroughIncludeChildrenforme = (node, checked) => {
        let { selectedValues, includeChildren, treetype } = this.state,
            treeNodeId = node.props.eventKey;
        const { idKey } = this.props;
        const isClassNode = this.state.treetype == 'type' && node.props.treeNodeData.nodedata == 'nodeclass';
        includeChildren = includeChildren || isClassNode; //点击的是分类节点按照包含下级处理

        if (includeChildren) {
            // 包含下级
            //let mapFunc = selectedValues.get(treeNodeId) ? selectedValues.delete : selectedValues.set;
            let mapFunc = !checked ? selectedValues.delete : selectedValues.set;
            // 选中所有下级节点
            (function func(node) {
                let data = node.props.treeNodeData,
                    children = node.props.children;
                if (treetype == 'type' && node.props.treeNodeData.nodedata == 'nodeclass') {
                } else {
                    mapFunc.call(selectedValues, data._path || data[idKey], data);
                }
                if (Array.isArray(children)) {
                    children.forEach((e) => void func(e));
                }
            })(node);
        } else {
            // 选中单个节点
            let data = node.props.treeNodeData;
            !checked ? selectedValues.delete(treeNodeId, data) : selectedValues.set(treeNodeId, data);
        }
        if (isClassNode) {
            this.selectRootKeys = checked
                ? [ ...this.selectRootKeys, node.props.nodeData.refpk ]
                : this.selectRootKeys.filter((k) => {
                      return k != node.props.nodeData.refpk;
                  });
        }

        return selectedValues;
    };

    setTreeData = (target, parentNode, data, cb) => {
        let { expandedKeys, textValue } = this.state;
        data.rows.forEach((e) => {
            e._display = e.title;
            e.pid = e.pid || rootNode.refpk;
        });
        var expandkeyAll = [];
        if (textValue && textValue.length > 0) {
            var loopNode = (nodes) => {
                nodes.forEach((node) => {
                    expandkeyAll.push(node.refpk);
                    loopNode(node.children || []);
                });
            };
            loopNode(data.rows);
        }
        this.setState(
            {
                //[target]: this.state[target],
                [target]: data.rows || [],
                expandedKeys: expandkeyAll,

                search: {
                    ...this.state.search,
                    value: undefined
                }
            },
            () => {
                debugger;
                typeof cb === 'function' && cb();
            }
        );
    };
    // 节点展开方法
    // onTreeNodeExpand = (expandedKeys)=>{
    // 	console.log(expandedKeys);
    // 	this.state.expandedKeys = expandedKeys;
    // }
    // 复写原型方法：渲染顶部 集团参照
    renderPopoverHeaderExtend = () => {
        return (
            <div style={{ width: 200, paddingLeft: 10 }}>
                {this.props.showGroup ? <Refer {...this.state.refGroup} /> : ''}
            </div>
        );
    };
    // 复写原型方法：渲染弹出层左侧
    renderPopoverLeft = () => {
        let { isSearch, selectedKeys, expandedKeys, selectedValues, treeData } = this.state;
        const {
            refType,
            isMultiSelectedEnabled,
            isTreelazyLoad,
            rootNode,
            onlyLeafCanSelect,
            disabledDataShow
        } = this.props;

        //树表state
        var loopNode = (nodes, handler) => {
            nodes.forEach((node) => {
                handler && handler(node, node.children || []);
                loopNode(node.children || [], handler);
            });
        };

        var laybtns = [],
            createNumberBtns = (nodes) => {
                //获取树节点层级号数组
                var maxlaynumber = 1,
                    i,
                    btns = [],
                    hander = (node, children) => {
                        var nodenumber = parseInt(node.nodeData ? node.nodeData.laynumber : 0);
                        maxlaynumber = nodenumber <= maxlaynumber ? maxlaynumber : nodenumber;
                    };
                loopNode(nodes, hander);
                for (i = 0; i <= maxlaynumber; i++) {
                    laybtns.push(
                        <NCMenu.Item key={i} expandLay={true}>
                            {langCheck('0000PUB-000039')}
                            {/* 国际化处理： 展开*/}
                            {i + 1}
                            {langCheck('0000PUB-000040')}
                            {/* 国际化处理： 级*/}
                        </NCMenu.Item>
                    );
                }
            };
        createNumberBtns(treeData || []);

        var onMenuSelect = (domEvent, item, key) => {
            if (domEvent.key == 'expandAll') {
                var key = [],
                    keyHander = (node, children) => {
                        key.push(node.key);
                    };
                loopNode(treeData, keyHander);
                this.state.expandedKeys = key;
                this.setState(this.state);
            }
            if (domEvent.key == 'unexpandAll') {
                this.state.expandedKeys = [];
                this.setState(this.state);
            }
            if (domEvent.item.props.expandLay) {
                var key = [],
                    layno = domEvent.key,
                    keyHander = (node, children) => {
                        var nodenumber = parseInt(node.nodeData ? node.nodeData.laynumber : 0);
                        if (nodenumber <= layno) {
                            key.push(node.key);
                        }
                    };
                loopNode(treeData, keyHander);
                this.state.expandedKeys = key;
                this.setState(this.state);
            }
        };

        var createMore = () => {
            return (
                <NCMenu onSelect={onMenuSelect}>
                    <NCMenu.Item key='expandAll'>{langCheck('0000PUB-000041')}</NCMenu.Item>
                    {/* 国际化处理： 展开全部*/}
                    <NCMenu.Item key='unexpandAll'>{langCheck('0000PUB-000042')}</NCMenu.Item>
                    {/* 国际化处理： 收起全部*/}
                    <NCMenu.NCSubMenu key='expandLay' title={langCheck('0000PUB-000037')}>
                        {/* 国际化处理： 展开级次*/}
                        {laybtns}
                    </NCMenu.NCSubMenu>
                </NCMenu>
            );
        };

        var renderSearch = {
            ...this.state.search,
            value: this.state.search.valueTemp
        };

        return (
            <div style={{ paddingLeft: 10 }}>
                <div style={{ paddingLeft: 10 }}>
                    <div
                        className='accountBookGrid_wrap_neibu'
                        style={{
                            display: 'flex',
                            marginTop: 10,
                            justifyContent: 'flex-start',
                            marginBottom: 10
                        }}
                    >
                        <div style={{ position: 'relative' }} className='icon-qingkong-hover-container'>
                            <NCFormControl {...renderSearch} />
                            <i
                                class='icon iconfont icon-sousuo syncTreeSearchIcon'
                                style={{
                                    position: 'absolute',
                                    right: 5,
                                    color: '#878b94'
                                }}
                            />
                            {this.state.search.valueTemp && (
                                <i
                                    style={{
                                        position: 'absolute',
                                        top: 7,
                                        right: 20,
                                        color: '#878b94'
                                    }}
                                    className='refer-del-i iconfont icon-qingkong icon-qingkong-hover'
                                    onClick={() => {
                                        this.state.search.valueTemp = '';
                                        this.setState({
                                            search: this.state.search
                                        });
                                    }}
                                />
                            )}
                        </div>
                        <div style={{ marginLeft: 10, paddingTop: 2 }}>
                            {isMultiSelectedEnabled && this.showInCludeChildren ? (
                                <NCCheckbox className='AccountBookTreeref-Search-checkbox' {...this.state.subOrg}>
                                    {langCheck('0000PUB-000043')}
                                    {/* 国际化处理： 包含下级*/}
                                </NCCheckbox>
                            ) : (
                                ''
                            )}
                            {disabledDataShow ? (
                                <NCCheckbox className='AccountBookTreeref-Search-checkbox' {...this.state.mshowoff}>
                                    {langCheck('0000PUB-000044')}
                                    {/* 国际化处理： 显示停用*/}
                                </NCCheckbox>
                            ) : (
                                ''
                            )}
                        </div>
                        <NCDropdown trigger={[ 'click' ]} overlay={createMore()} animation='slide-up'>
                            <span className='more-button' style={{ marginTop: 7 }}>
                                {langCheck('0000PUB-000045')}
                                {/* 国际化处理： 更多*/}
                            </span>
                        </NCDropdown>
                    </div>
                    <div>
                        <RadioGroup
                            name='booktype'
                            selectedValue={this.state.treetype}
                            onChange={this.onTreeTypeChange.bind(this)}
                        >
                            <Radio value='type'>{langCheck('0000PUB-000035')}</Radio>
                            {/* 国际化处理： 账簿类型*/}
                            <Radio value='main'>{langCheck('0000PUB-000036')}</Radio>
                            {/* 国际化处理： 主账簿*/}
                        </RadioGroup>
                    </div>
                </div>
                <div style={{ height: 350, overflow: 'auto', paddingLeft: 10 }}>
                    <ReferTree
                        checkStrictly={true}
                        checkable={refType === 'tree' && isMultiSelectedEnabled}
                        data={treeData}
                        showLine={true}
                        onSelect={this.onTreeNodeSelectWapper.bind(this)}
                        onExpand={this.onTreeNodeExpand.bind(this)}
                        onCheck={this.onTreeNodeCheckWapper.bind(this)}
                        checkedKeys={[ ...selectedValues.keys(), ...this.selectRootKeys ]}
                        selectedKeys={selectedKeys}
                        expandedKeys={expandedKeys}
                        autoExpandParent={false}
                        isTreelazyLoad={isTreelazyLoad}
                        root={rootNode}
                        onlyLeafCanSelect={onlyLeafCanSelect}
                        searchValue={this.state.search.value}
                        onDoubleClick={this.onTreeNodeDoubleClickWapper.bind(this)}
                    />
                </div>
            </div>
        );
    };
}

export default function(props = {}) {
    var conf = {
        refName: langCheck('0000PUB-000038') /* 国际化处理： 财务核算账簿*/,
        placeholder: langCheck('0000PUB-000038') /* 国际化处理： 财务核算账簿*/,
        rootNode: { refname: langCheck('0000PUB-000038'), refpk: 'root' } /* 国际化处理： 财务核算账簿*/,
        refCode: 'uapbd.ref.AccountBookTreeRef',
        queryTreeUrl: '/nccloud/uapbd/ref/AccountBookTreeRef.do',
        isMultiSelectedEnabled: true,
        refType: 'tree',
        isTreelazyLoad: false,
        treeConfig: {
            name: [ langCheck('0000PUB-000032'), langCheck('0000PUB-000033') ],
            code: [ 'refcode', 'refname' ]
        } /* 国际化处理： 编码,名称*/,
        showGroup: false,
        //isCacheable:true,
        showInCludeChildren: true,
        disabledDataShow: false
    };
    conf.rootNode = { ...conf.rootNode, treeid: 'root' };
    return <Ref {...Object.assign(conf, props)} />;
}
